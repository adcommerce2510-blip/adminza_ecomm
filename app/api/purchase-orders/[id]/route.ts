import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PurchaseOrder from '@/models/PurchaseOrder'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const purchaseOrder = await PurchaseOrder.findById(params.id)
    
    if (!purchaseOrder) {
      return NextResponse.json(
        { success: false, error: 'Purchase order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: purchaseOrder
    })
  } catch (error) {
    console.error('Error fetching purchase order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch purchase order' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const purchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
    
    if (!purchaseOrder) {
      return NextResponse.json(
        { success: false, error: 'Purchase order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: purchaseOrder
    })
  } catch (error: any) {
    console.error('Error updating purchase order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update purchase order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const purchaseOrder = await PurchaseOrder.findByIdAndDelete(params.id)
    
    if (!purchaseOrder) {
      return NextResponse.json(
        { success: false, error: 'Purchase order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Purchase order deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting purchase order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete purchase order' },
      { status: 500 }
    )
  }
}





