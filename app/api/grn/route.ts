import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PurchaseOrder from '@/models/PurchaseOrder'
import WarehouseStock from '@/models/WarehouseStock'
import EshopInventory from '@/models/EshopInventory'
import Product from '@/models/Product'
import WasteEntry from '@/models/WasteEntry'

// Generate sequential GRN number
async function generateGRNNumber(): Promise<string> {
  try {
    await dbConnect()
    // For simplicity, using timestamp-based GRN
    // You can create a GRN model if you need sequential numbering
    const timestamp = Date.now()
    return `GRN-${timestamp.toString().slice(-6)}`
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
    
    if (!body.poNumber) {
      return NextResponse.json(
        { success: false, error: 'PO number is required' },
        { status: 400 }
      )
    }
    
    // Find the purchase order
    const purchaseOrder = await PurchaseOrder.findOne({ poNumber: body.poNumber })
    
    if (!purchaseOrder) {
      return NextResponse.json(
        { success: false, error: 'Purchase order not found' },
        { status: 404 }
      )
    }
    
    if (purchaseOrder.status === 'received') {
      return NextResponse.json(
        { success: false, error: 'Purchase order already received' },
        { status: 400 }
      )
    }
    
    const grnNumber = await generateGRNNumber()
    const warehouseName = body.warehouseName || 'Main Warehouse'
    
    // Process items from body.items if provided (with damaged/lost), otherwise use PO items
    const itemsToProcess = body.items && body.items.length > 0 
      ? body.items 
      : purchaseOrder.items.map((item: any) => ({
          productId: item.productId,
          productName: item.productName,
          receivedQuantity: item.quantity,
          damagedQuantity: 0,
          lostQuantity: 0,
          acceptedQuantity: item.quantity
        }))
    
    // Process each item
    for (const itemData of itemsToProcess) {
      const poItem = purchaseOrder.items.find((item: any) => item.productId === itemData.productId)
      if (!poItem) continue

      const receivedQty = itemData.receivedQuantity || poItem.quantity
      const damagedQty = itemData.damagedQuantity || 0
      const lostQty = itemData.lostQuantity || 0
      const acceptedQty = itemData.acceptedQuantity || (receivedQty - damagedQty - lostQty)
      
      if (purchaseOrder.deliveryType === 'to_warehouse') {
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
              lastSupplier: purchaseOrder.supplierName
            }
          },
          { upsert: true, new: true }
        )
        
        // Create waste entries for damaged items
        if (damagedQty > 0) {
          const wasteEntry = new WasteEntry({
            productId: itemData.productId,
            productName: itemData.productName,
            quantity: damagedQty,
            warehouseName,
            supplierName: purchaseOrder.supplierName,
            reason: 'damaged',
            description: `Damaged during receipt from PO ${body.poNumber}`,
            date: new Date()
          })
          await wasteEntry.save()
        }
        
        // Create waste entries for lost items
        if (lostQty > 0) {
          const wasteEntry = new WasteEntry({
            productId: itemData.productId,
            productName: itemData.productName,
            quantity: lostQty,
            warehouseName,
            supplierName: purchaseOrder.supplierName,
            reason: 'lost',
            description: `Lost during receipt from PO ${body.poNumber}`,
            date: new Date()
          })
          await wasteEntry.save()
        }
        
        // Update product supplier info if not set
        const product = await Product.findById(itemData.productId)
        if (product && !product.supplier?.name) {
          product.supplier = {
            name: purchaseOrder.supplierName,
            contact: '',
            email: '',
            phone: ''
          }
          await product.save()
        }
      } else if (purchaseOrder.deliveryType === 'direct_to_customer' && purchaseOrder.customerId) {
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
          const newInventory = new EshopInventory({
            productId: itemData.productId,
            productName: itemData.productName,
            customerId: purchaseOrder.customerId,
            customerName: purchaseOrder.customerName || '',
            quantity: acceptedQty,
            price: poItem.unitPrice,
            notes: `Direct delivery from ${purchaseOrder.supplierName} - PO ${body.poNumber}`
          })
          await newInventory.save()
        }
        
        // Update product supplier info
        const product = await Product.findById(itemData.productId)
        if (product && !product.supplier?.name) {
          product.supplier = {
            name: purchaseOrder.supplierName,
            contact: '',
            email: '',
            phone: ''
          }
          await product.save()
        }
      }
    }
    
    // Update PO status
    purchaseOrder.status = 'received'
    const totalReceived = itemsToProcess.reduce((sum: number, item: any) => sum + (item.receivedQuantity || item.quantity || 0), 0)
    purchaseOrder.receivedQuantity = totalReceived
    await purchaseOrder.save()
    
    return NextResponse.json({
      success: true,
      data: {
        grnNumber,
        purchaseOrder,
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
    
    // Return list of received POs (which are essentially GRNs)
    const receivedPOs = await PurchaseOrder.find({ status: 'received' })
      .sort({ updatedAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: receivedPOs
    })
  } catch (error) {
    console.error('Error fetching GRNs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GRNs' },
      { status: 500 }
    )
  }
}

