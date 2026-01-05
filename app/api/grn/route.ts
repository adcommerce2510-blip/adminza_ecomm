import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PurchaseOrder from '@/models/PurchaseOrder'
import WarehouseStock from '@/models/WarehouseStock'
import EshopInventory from '@/models/EshopInventory'
import Product from '@/models/Product'
import WasteEntry from '@/models/WasteEntry'
import GRN from '@/models/GRN'

// Generate sequential GRN number
async function generateGRNNumber(): Promise<string> {
  try {
    await dbConnect()
    const lastGRN = await GRN.findOne().sort({ createdAt: -1 }).lean()
    if (lastGRN && lastGRN.grnNumber) {
      const match = lastGRN.grnNumber.match(/^GRN-(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        const nextNumber = num + 1
        return `GRN-${nextNumber.toString().padStart(6, '0')}`
      }
    }
    return 'GRN-000001'
  } catch (error) {
    console.error('Error generating GRN number:', error)
    const timestamp = Date.now()
    return `GRN-${timestamp.toString().slice(-6)}`
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const grnType = body.grnType || (body.poNumber ? 'GRN_CREATED' : 'DIRECT_GRN')
    const grnNumber = await generateGRNNumber()
    const warehouseName = body.warehouseName || 'Main Warehouse'
    
    let purchaseOrder = null
    let itemsToProcess: any[] = []
    
    // Handle Direct GRN (no PO)
    if (grnType === 'DIRECT_GRN') {
      if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Items are required for Direct GRN' },
          { status: 400 }
        )
      }
      
      itemsToProcess = body.items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        orderedQuantity: 0, // No PO, so no ordered quantity
        receivedQuantity: item.receivedQuantity || item.quantity || 0,
        acceptedQuantity: item.acceptedQuantity || (item.receivedQuantity || item.quantity || 0) - (item.damagedQuantity || 0) - (item.lostQuantity || 0),
        damagedQuantity: item.damagedQuantity || 0,
        lostQuantity: item.lostQuantity || 0
      }))
    } 
    // Handle GRN linked to PO
    else {
      if (!body.poNumber) {
        return NextResponse.json(
          { success: false, error: 'PO number is required for GRN_CREATED type' },
          { status: 400 }
        )
      }
      
      purchaseOrder = await PurchaseOrder.findOne({ poNumber: body.poNumber })
      if (!purchaseOrder) {
        return NextResponse.json(
          { success: false, error: 'Purchase order not found' },
          { status: 404 }
        )
      }
      
      // Check if PO is reference type (can still link GRN)
      if (purchaseOrder.poType === 'reference') {
        // Allow GRN for reference PO
      } else if (purchaseOrder.status === 'PO_CLOSED') {
        return NextResponse.json(
          { success: false, error: 'Purchase order is already closed' },
          { status: 400 }
        )
      }
      
      // Process items from body.items if provided, otherwise use PO items
      itemsToProcess = body.items && body.items.length > 0 
        ? body.items.map((item: any) => {
            const poItem = purchaseOrder.items.find((po: any) => po.productId === item.productId)
            return {
              productId: item.productId,
              productName: item.productName,
              orderedQuantity: poItem ? poItem.quantity : 0,
              receivedQuantity: item.receivedQuantity || 0,
              acceptedQuantity: item.acceptedQuantity || (item.receivedQuantity || 0) - (item.damagedQuantity || 0) - (item.lostQuantity || 0),
              damagedQuantity: item.damagedQuantity || 0,
              lostQuantity: item.lostQuantity || 0
            }
          })
        : purchaseOrder.items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            orderedQuantity: item.quantity,
            receivedQuantity: item.quantity,
            acceptedQuantity: item.quantity,
            damagedQuantity: 0,
            lostQuantity: 0
          }))
    }
    
    // Validate items
    for (const item of itemsToProcess) {
      if (item.acceptedQuantity < 0) {
        return NextResponse.json(
          { success: false, error: `Invalid quantities for ${item.productName}. Accepted quantity cannot be negative.` },
          { status: 400 }
        )
      }
      if (purchaseOrder && item.receivedQuantity > item.orderedQuantity) {
        return NextResponse.json(
          { success: false, error: `Received quantity for ${item.productName} cannot exceed ordered quantity.` },
          { status: 400 }
        )
      }
    }
    
    // Create GRN record
    const grn = new GRN({
      grnNumber,
      poNumber: body.poNumber || null,
      grnType,
      supplierName: body.supplierName || purchaseOrder?.supplierName || '',
      warehouseName,
      location: body.location || {},
      items: itemsToProcess,
      status: 'IN_WAREHOUSE',
      notes: body.notes || '',
      createdBy: body.createdBy
    })
    
    await grn.save()
    
    // Process inventory updates
    for (const itemData of itemsToProcess) {
      const acceptedQty = itemData.acceptedQuantity
      const receivedQty = itemData.receivedQuantity
      const damagedQty = itemData.damagedQuantity || 0
      const lostQty = itemData.lostQuantity || 0
      
      if (purchaseOrder && purchaseOrder.deliveryType === 'to_warehouse') {
        // Update warehouse stock with accepted quantity only
        await WarehouseStock.findOneAndUpdate(
          {
            productId: itemData.productId,
            warehouseName
          },
          {
            $inc: {
              availableStock: acceptedQty,
              totalReceivedFromSupplier: receivedQty
            },
            $set: {
              productName: itemData.productName,
              lastReceivedDate: new Date(),
              lastSupplier: purchaseOrder.supplierName,
              grnBatchId: grnNumber,
              status: 'IN_WAREHOUSE',
              location: body.location || {}
            }
          },
          { upsert: true, new: true }
        )
        
        // Create waste entries for damaged items (from GRN stage)
        if (damagedQty > 0) {
          const wasteEntry = new WasteEntry({
            productId: itemData.productId,
            productName: itemData.productName,
            quantity: damagedQty,
            warehouseName,
            supplierName: purchaseOrder.supplierName,
            reason: 'damaged',
            description: `Damaged during receipt from PO ${body.poNumber || 'Direct GRN'}`,
            grnBatchId: grnNumber,
            adjustmentType: 'from_grn',
            status: 'WASTED',
            date: new Date()
          })
          await wasteEntry.save()
        }
        
        // Create waste entries for lost items (from GRN stage)
        if (lostQty > 0) {
          const wasteEntry = new WasteEntry({
            productId: itemData.productId,
            productName: itemData.productName,
            quantity: lostQty,
            warehouseName,
            supplierName: purchaseOrder.supplierName,
            reason: 'lost',
            description: `Lost during receipt from PO ${body.poNumber || 'Direct GRN'}`,
            grnBatchId: grnNumber,
            adjustmentType: 'from_grn',
            status: 'WASTED',
            date: new Date()
          })
          await wasteEntry.save()
        }
      } else if (purchaseOrder && purchaseOrder.deliveryType === 'direct_to_customer' && purchaseOrder.customerId) {
        // Add to customer inventory (EshopInventory) - only accepted quantity
        const existingInventory = await EshopInventory.findOne({
          productId: itemData.productId,
          customerId: purchaseOrder.customerId
        })
        
        if (existingInventory) {
          existingInventory.quantity += acceptedQty
          existingInventory.lastUpdated = new Date()
          await existingInventory.save()
        } else {
          const poItem = purchaseOrder.items.find((item: any) => item.productId === itemData.productId)
          const newInventory = new EshopInventory({
            productId: itemData.productId,
            productName: itemData.productName,
            customerId: purchaseOrder.customerId,
            customerName: purchaseOrder.customerName || '',
            quantity: acceptedQty,
            price: poItem?.unitPrice || 0,
            notes: `Direct delivery from ${purchaseOrder.supplierName} - PO ${body.poNumber}`
          })
          await newInventory.save()
        }
      } else if (grnType === 'DIRECT_GRN') {
        // Direct GRN - update warehouse stock
        await WarehouseStock.findOneAndUpdate(
          {
            productId: itemData.productId,
            warehouseName
          },
          {
            $inc: {
              availableStock: acceptedQty,
              totalReceivedFromSupplier: receivedQty
            },
            $set: {
              productName: itemData.productName,
              lastReceivedDate: new Date(),
              lastSupplier: body.supplierName || '',
              grnBatchId: grnNumber,
              status: 'IN_WAREHOUSE',
              location: body.location || {}
            }
          },
          { upsert: true, new: true }
        )
        
        // Create waste entries for damaged/lost items
        if (damagedQty > 0) {
          const wasteEntry = new WasteEntry({
            productId: itemData.productId,
            productName: itemData.productName,
            quantity: damagedQty,
            warehouseName,
            supplierName: body.supplierName || '',
            reason: 'damaged',
            description: `Damaged during Direct GRN receipt`,
            grnBatchId: grnNumber,
            adjustmentType: 'from_grn',
            status: 'WASTED',
            date: new Date()
          })
          await wasteEntry.save()
        }
        
        if (lostQty > 0) {
          const wasteEntry = new WasteEntry({
            productId: itemData.productId,
            productName: itemData.productName,
            quantity: lostQty,
            warehouseName,
            supplierName: body.supplierName || '',
            reason: 'lost',
            description: `Lost during Direct GRN receipt`,
            grnBatchId: grnNumber,
            adjustmentType: 'from_grn',
            status: 'WASTED',
            date: new Date()
          })
          await wasteEntry.save()
        }
      }
      
      // Update product supplier info if not set
      const product = await Product.findById(itemData.productId)
      if (product && !product.supplier?.name) {
        product.supplier = {
          name: purchaseOrder?.supplierName || body.supplierName || '',
          contact: '',
          email: '',
          phone: ''
        }
        await product.save()
      }
    }
    
    // Update PO status if linked to PO
    if (purchaseOrder && purchaseOrder.poType !== 'reference') {
      // Calculate total received quantity for this GRN
      const totalReceivedThisGRN = itemsToProcess.reduce((sum: number, item: any) => sum + item.receivedQuantity, 0)
      
      // Update PO received quantity
      purchaseOrder.receivedQuantity = (purchaseOrder.receivedQuantity || 0) + totalReceivedThisGRN
      
      // Calculate total ordered quantity
      const totalOrderedQuantity = purchaseOrder.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
      
      // Update pending quantity
      purchaseOrder.pendingQuantity = Math.max(0, totalOrderedQuantity - purchaseOrder.receivedQuantity)
      
      // Update PO status
      if (purchaseOrder.receivedQuantity >= totalOrderedQuantity) {
        purchaseOrder.status = 'PO_CLOSED'
      } else if (purchaseOrder.receivedQuantity > 0) {
        purchaseOrder.status = 'PO_PARTIALLY_RECEIVED'
      }
      
      // Add GRN link
      if (!purchaseOrder.grnLinks) {
        purchaseOrder.grnLinks = []
      }
      purchaseOrder.grnLinks.push(grnNumber)
      
      await purchaseOrder.save()
    }
    
    return NextResponse.json({
      success: true,
      data: {
        grn,
        purchaseOrder: purchaseOrder || null,
        message: 'Goods received successfully'
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error processing GRN:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process GRN' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const poNumber = searchParams.get('poNumber')
    const grnType = searchParams.get('grnType')
    
    let query: any = {}
    if (poNumber) {
      query.poNumber = poNumber
    }
    if (grnType) {
      query.grnType = grnType
    }
    
    const grns = await GRN.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: grns
    })
  } catch (error) {
    console.error('Error fetching GRNs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GRNs' },
      { status: 500 }
    )
  }
}
