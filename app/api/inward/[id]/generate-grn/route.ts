import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import InwardEntry from '@/models/InwardEntry'
import GRN from '@/models/GRN'
import WarehouseStock from '@/models/WarehouseStock'
import WasteEntry from '@/models/WasteEntry'
import PurchaseOrder from '@/models/PurchaseOrder'
import EshopInventory from '@/models/EshopInventory'

// Generate unique GRN number: GRN-YYYY-XXXX
async function generateGRNNumber(): Promise<string> {
  try {
    await dbConnect()
    const currentYear = new Date().getFullYear()
    const prefix = `GRN-${currentYear}-`
    
    const latestGRN = await GRN.findOne({
      grnNumber: new RegExp(`^${prefix}`)
    }).sort({ grnNumber: -1 })
    
    let sequence = 1
    if (latestGRN) {
      const lastSequence = parseInt(latestGRN.grnNumber.split('-')[2] || '0')
      sequence = lastSequence + 1
    }
    
    return `${prefix}${sequence.toString().padStart(4, '0')}`
  } catch (error) {
    console.error('Error generating GRN number:', error)
    const currentYear = new Date().getFullYear()
    return `GRN-${currentYear}-0001`
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const inwardId = params.id
    const body = await request.json()
    
    // Fetch inward entry
    const inwardEntry = await InwardEntry.findById(inwardId)
    if (!inwardEntry) {
      return NextResponse.json(
        { success: false, error: 'Inward entry not found' },
        { status: 404 }
      )
    }
    
    if (inwardEntry.status === 'GRN_CREATED') {
      return NextResponse.json(
        { success: false, error: 'GRN already generated for this inward entry' },
        { status: 400 }
      )
    }
    
    // Generate GRN number
    const grnNumber = await generateGRNNumber()
    const warehouseName = body.warehouseName || 'Main Warehouse'
    
    // Fetch PO if linked
    let purchaseOrder = null
    if (inwardEntry.poNumber) {
      purchaseOrder = await PurchaseOrder.findOne({ poNumber: inwardEntry.poNumber })
    }
    
    // Check if split allocation is requested
    const isSplitStock = body.splitToCustomer === true && body.customerId && body.itemAllocations
    const customerId = body.customerId || null
    const customerName = body.customerName || null
    
    // Process items from inward entry with allocation
    const itemsToProcess = inwardEntry.items.map((item: any) => {
      const allocation = isSplitStock 
        ? body.itemAllocations.find((a: any) => a.productId === item.productId)
        : null
      
      const customerQty = allocation?.customerQuantity || 0
      const warehouseQty = item.acceptedQuantity - customerQty
      
      return {
        productId: item.productId,
        productName: item.productName,
        orderedQuantity: item.orderedQuantity || 0,
        receivedQuantity: item.receivedQuantity,
        damagedQuantity: item.damagedQuantity || 0,
        lostQuantity: item.lostQuantity || 0,
        acceptedQuantity: item.acceptedQuantity,
        unitPrice: item.unitPrice || 0,
        customerAllocation: isSplitStock && customerQty > 0 ? {
          customerId: customerId,
          customerName: customerName,
          quantity: customerQty
        } : null,
        warehouseQuantity: warehouseQty
      }
    })
    
    // Create GRN
    const grn = new GRN({
      grnNumber,
      poNumber: inwardEntry.poNumber || null,
      grnType: inwardEntry.inwardType === 'PO_LINKED' ? 'GRN_CREATED' : 'DIRECT_GRN',
      supplierName: inwardEntry.supplierName,
      warehouseName,
      location: body.location || {},
      items: itemsToProcess,
      status: 'IN_WAREHOUSE',
      customerId: isSplitStock ? customerId : null,
      customerName: isSplitStock ? customerName : null,
      notes: body.notes || inwardEntry.notes || '',
      createdBy: body.createdBy || inwardEntry.createdBy
    })
    
    await grn.save()
    
    // Process inventory updates - Handle split allocation
    for (const itemData of itemsToProcess) {
      const acceptedQty = itemData.acceptedQuantity
      const receivedQty = itemData.receivedQuantity
      const damagedQty = itemData.damagedQuantity || 0
      const lostQty = itemData.lostQuantity || 0
      const customerQty = itemData.customerAllocation?.quantity || 0
      const warehouseQty = itemData.warehouseQuantity || acceptedQty
      
      // Add customer allocation to customer inventory (EshopInventory)
      if (isSplitStock && customerQty > 0 && customerId) {
        const existingInventory = await EshopInventory.findOne({
          productId: itemData.productId,
          customerId: customerId
        })
        
        if (existingInventory) {
          existingInventory.quantity += customerQty
          existingInventory.lastUpdated = new Date()
          if (itemData.unitPrice > 0) {
            existingInventory.price = itemData.unitPrice
          }
          await existingInventory.save()
        } else {
          const newInventory = new EshopInventory({
            productId: itemData.productId,
            productName: itemData.productName,
            customerId: customerId,
            customerName: customerName || '',
            quantity: customerQty,
            price: itemData.unitPrice || 0,
            notes: `Direct allocation from Inward ${inwardEntry.inwardNumber} - GRN ${grnNumber}`
          })
          await newInventory.save()
        }
      }
      
      // Update warehouse stock - Only warehouse quantity is added
      if (warehouseQty > 0) {
        await WarehouseStock.findOneAndUpdate(
          {
            productId: itemData.productId,
            warehouseName
          },
          {
            $inc: {
              availableStock: warehouseQty, // Only warehouse portion added to stock
              totalReceivedFromSupplier: receivedQty
            },
            $set: {
              productName: itemData.productName,
              lastReceivedDate: new Date(),
              lastSupplier: inwardEntry.supplierName,
              grnBatchId: grnNumber,
              status: 'IN_WAREHOUSE',
              location: body.location || {}
            }
          },
          { upsert: true, new: true }
        )
      }
      
      // Create waste entries for damaged items (not added to warehouse stock)
      if (damagedQty > 0) {
        const wasteEntry = new WasteEntry({
          productId: itemData.productId,
          productName: itemData.productName,
          quantity: damagedQty,
          warehouseName,
          supplierName: inwardEntry.supplierName,
          reason: 'damaged',
          description: `Damaged during receipt from Inward ${inwardEntry.inwardNumber}`,
          grnBatchId: grnNumber,
          adjustmentType: 'from_grn',
          status: 'WASTED',
          date: new Date()
        })
        await wasteEntry.save()
      }
      
      // Create waste entries for lost items (not added to warehouse stock)
      if (lostQty > 0) {
        const wasteEntry = new WasteEntry({
          productId: itemData.productId,
          productName: itemData.productName,
          quantity: lostQty,
          warehouseName,
          supplierName: inwardEntry.supplierName,
          reason: 'lost',
          description: `Lost during receipt from Inward ${inwardEntry.inwardNumber}`,
          grnBatchId: grnNumber,
          adjustmentType: 'from_grn',
          status: 'WASTED',
          date: new Date()
        })
        await wasteEntry.save()
      }
    }
    
    // Update PO status if linked
    if (purchaseOrder && purchaseOrder.poType !== 'reference') {
      const totalReceivedThisGRN = itemsToProcess.reduce((sum: number, item: any) => sum + item.receivedQuantity, 0)
      purchaseOrder.receivedQuantity = (purchaseOrder.receivedQuantity || 0) + totalReceivedThisGRN
      
      const totalOrderedQuantity = purchaseOrder.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
      purchaseOrder.pendingQuantity = Math.max(0, totalOrderedQuantity - purchaseOrder.receivedQuantity)
      
      if (purchaseOrder.receivedQuantity >= totalOrderedQuantity) {
        purchaseOrder.status = 'PO_CLOSED'
      } else if (purchaseOrder.receivedQuantity > 0) {
        purchaseOrder.status = 'PO_PARTIALLY_RECEIVED'
      }
      
      if (!purchaseOrder.grnLinks) {
        purchaseOrder.grnLinks = []
      }
      purchaseOrder.grnLinks.push(grnNumber)
      await purchaseOrder.save()
    }
    
    // Update inward entry status and add GRN link
    inwardEntry.status = 'GRN_CREATED'
    if (!inwardEntry.grnLinks) {
      inwardEntry.grnLinks = []
    }
    inwardEntry.grnLinks.push(grnNumber)
    await inwardEntry.save()
    
    return NextResponse.json({
      success: true,
      data: {
        grn,
        inwardEntry,
        purchaseOrder: purchaseOrder || null,
        message: 'GRN generated successfully from inward entry'
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error generating GRN from inward:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate GRN from inward entry' },
      { status: 500 }
    )
  }
}

