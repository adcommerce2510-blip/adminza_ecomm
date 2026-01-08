import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import InwardEntry from '@/models/InwardEntry'
import PurchaseOrder from '@/models/PurchaseOrder'
import GRN from '@/models/GRN'

// Generate unique inward number: INW-YYYY-XXXX
async function generateInwardNumber(): Promise<string> {
  try {
    await dbConnect()
    const currentYear = new Date().getFullYear()
    const prefix = `INW-${currentYear}-`
    
    // Find the latest inward entry for this year
    const latestInward = await InwardEntry.findOne({
      inwardNumber: new RegExp(`^${prefix}`)
    }).sort({ inwardNumber: -1 })
    
    let sequence = 1
    if (latestInward) {
      const lastSequence = parseInt(latestInward.inwardNumber.split('-')[2] || '0')
      sequence = lastSequence + 1
    }
    
    return `${prefix}${sequence.toString().padStart(4, '0')}`
  } catch (error) {
    console.error('Error generating inward number:', error)
    const currentYear = new Date().getFullYear()
    return `INW-${currentYear}-0001`
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const inwardType = body.inwardType || (body.poNumber ? 'PO_LINKED' : 'DIRECT_INWARD')
    const inwardNumber = await generateInwardNumber()
    
    let purchaseOrder = null
    
    // If linked to PO, fetch and validate
    if (inwardType === 'PO_LINKED' && body.poNumber) {
      purchaseOrder = await PurchaseOrder.findOne({ poNumber: body.poNumber })
      if (!purchaseOrder) {
        return NextResponse.json(
          { success: false, error: 'Purchase Order not found' },
          { status: 404 }
        )
      }
    }
    
    // Process items and calculate accepted quantity
    const items = body.items.map((item: any) => {
      const receivedQty = item.receivedQuantity || 0
      const damagedQty = item.damagedQuantity || 0
      const lostQty = item.lostQuantity || 0
      const acceptedQty = receivedQty - damagedQty - lostQty
      
      return {
        productId: item.productId,
        productName: item.productName,
        orderedQuantity: item.orderedQuantity || 0,
        receivedQuantity: receivedQty,
        damagedQuantity: damagedQty,
        lostQuantity: lostQty,
        acceptedQuantity: acceptedQty,
        unitPrice: item.unitPrice || 0
      }
    })
    
    const inwardEntry = new InwardEntry({
      inwardNumber,
      poNumber: body.poNumber || null,
      inwardType,
      supplierName: body.supplierName || (purchaseOrder?.supplierName || ''),
      receivedDate: body.receivedDate || new Date(),
      items,
      status: 'PENDING_GRN',
      grnLinks: [],
      notes: body.notes || '',
      createdBy: body.createdBy
    })
    
    await inwardEntry.save()
    
    return NextResponse.json({
      success: true,
      data: inwardEntry
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating inward entry:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create inward entry' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const poNumber = searchParams.get('poNumber')
    
    let query: any = {}
    if (status) {
      query.status = status
    }
    if (poNumber) {
      query.poNumber = poNumber
    }
    
    const inwardEntries = await InwardEntry.find(query)
      .sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: inwardEntries
    })
  } catch (error: any) {
    console.error('Error fetching inward entries:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch inward entries' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Inward entry ID is required' },
        { status: 400 }
      )
    }
    
    // Recalculate accepted quantities if items are updated
    if (updateData.items) {
      updateData.items = updateData.items.map((item: any) => {
        const receivedQty = item.receivedQuantity || 0
        const damagedQty = item.damagedQuantity || 0
        const lostQty = item.lostQuantity || 0
        const acceptedQty = receivedQty - damagedQty - lostQty
        
        return {
          ...item,
          acceptedQuantity: acceptedQty
        }
      })
    }
    
    const inwardEntry = await InwardEntry.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!inwardEntry) {
      return NextResponse.json(
        { success: false, error: 'Inward entry not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: inwardEntry
    })
  } catch (error: any) {
    console.error('Error updating inward entry:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update inward entry' },
      { status: 500 }
    )
  }
}





