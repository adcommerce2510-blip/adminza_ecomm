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

// Helper function to generate sequential order number
async function generateOrderNumber(): Promise<string> {
  try {
    // Get all orders with orderNo to find the highest number
    const orders = await Order.find({
      orderNo: { $exists: true, $ne: null, $regex: /^ORD-\d+$/ }
    }).select('orderNo').lean()
    
    let maxNumber = 0
    
    // Extract numeric part from each orderNo and find the maximum
    orders.forEach((order: any) => {
      if (order.orderNo) {
        const match = order.orderNo.match(/^ORD-(\d+)$/)
        if (match) {
          const num = parseInt(match[1], 10)
          if (num > maxNumber) {
            maxNumber = num
          }
        }
      }
    })
    
    // Increment by 1
    const nextNumber = maxNumber + 1
    
    // Format as ORD-0001, ORD-0002, etc. (4 digits with leading zeros)
    return `ORD-${nextNumber.toString().padStart(4, '0')}`
  } catch (error) {
    console.error('Error generating order number:', error)
    // Fallback: use timestamp if query fails
    const timestamp = Date.now()
    return `ORD-${timestamp.toString().slice(-4)}`
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Generate sequential order number
    const orderNo = await generateOrderNumber()
    
    // Validate required fields
    if (!body.userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email is required' },
        { status: 400 }
      )
    }
    
    const order = new Order({
      userId: body.userId,
      userEmail: body.userEmail,
      items: body.items || [],
      totalAmount: body.totalAmount || 0,
      shippingAddress: body.shippingAddress || {},
      phone: body.phone,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      company: body.company,
      gstNumber: body.gstNumber,
      notes: body.notes,
      status: body.status || 'Order Placed',
      orderDate: body.orderDate || new Date(),
      orderNo: orderNo // ALWAYS set orderNo, never null or undefined
      // The pre-save hook will ensure this is set even if somehow it becomes null
    })
    
    await order.save()
    
    return NextResponse.json({
      success: true,
      data: order
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
