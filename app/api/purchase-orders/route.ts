import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PurchaseOrder from '@/models/PurchaseOrder'

// Generate sequential PO number
async function generatePONumber(): Promise<string> {
  try {
    await dbConnect()
    const PurchaseOrderModel = PurchaseOrder
    const lastPO = await PurchaseOrderModel.findOne({
      poNumber: { $regex: /^PO-\d+$/ }
    }).sort({ poNumber: -1 }).lean()

    if (lastPO && lastPO.poNumber) {
      const match = lastPO.poNumber.match(/^PO-(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        const nextNumber = num + 1
        return `PO-${nextNumber.toString().padStart(4, '0')}`
      }
    }
    return 'PO-0001'
  } catch (error) {
    console.error('Error generating PO number:', error)
    const timestamp = Date.now()
    return `PO-${timestamp.toString().slice(-4)}`
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const deliveryType = searchParams.get('deliveryType')
    
    let query: any = {}
    if (status) {
      query.status = status
    }
    if (deliveryType) {
      query.deliveryType = deliveryType
    }
    
    const purchaseOrders = await PurchaseOrder.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: purchaseOrders
    })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchase orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    // Generate PO number
    const poNumber = await generatePONumber()
    
    // Validate required fields
    if (!body.supplierName || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Supplier name and items are required' },
        { status: 400 }
      )
    }
    
    // Calculate total amount
    const totalAmount = body.items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
    
    const poType = body.poType || 'standard'
    const initialStatus = poType === 'reference' ? 'PO_REFERENCE' : 'PO_CREATED'
    
    // Calculate total ordered quantity
    const totalOrderedQuantity = body.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
    
    const purchaseOrder = new PurchaseOrder({
      poNumber,
      supplierName: body.supplierName,
      items: body.items,
      totalAmount,
      deliveryType: body.deliveryType || 'to_warehouse',
      customerId: body.customerId,
      customerName: body.customerName,
      expectedDate: body.expectedDate,
      poType,
      status: initialStatus,
      receivedQuantity: 0,
      pendingQuantity: totalOrderedQuantity,
      grnLinks: [],
      notes: body.notes || '',
      createdBy: body.createdBy
    })
    
    await purchaseOrder.save()
    
    return NextResponse.json({
      success: true,
      data: purchaseOrder
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating purchase order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create purchase order' },
      { status: 500 }
    )
  }
}





