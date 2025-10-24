import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    
    let query: any = {}
    if (email) {
      query.userEmail = email
    }
    
    const orders = await Order.find(query).sort({ orderDate: -1 })
    
    return NextResponse.json({
      success: true,
      data: orders
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    const order = new Order({
      userEmail: body.userEmail,
      items: body.items,
      totalAmount: body.totalAmount,
      shippingAddress: body.shippingAddress,
      phone: body.phone,
      company: body.company,
      gstNumber: body.gstNumber,
      notes: body.notes,
      status: body.status || 'Order Placed',
      orderDate: body.orderDate || new Date()
    })
    
    await order.save()
    
    return NextResponse.json({
      success: true,
      data: order
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
