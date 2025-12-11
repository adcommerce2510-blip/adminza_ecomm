import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const customers = await Customer.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: customers
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    // Derive a username if one is not explicitly provided
    const derivedUsername =
      body.username?.trim() ||
      (body.email ? body.email.split('@')[0] : undefined)

    if (!derivedUsername) {
      return NextResponse.json(
        { success: false, error: 'Username or email is required' },
        { status: 400 }
      )
    }

    // Prevent duplicates by username or email
    const existing = await Customer.findOne({
      $or: [{ email: body.email }, { username: derivedUsername }],
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Customer with this email/username already exists' },
        { status: 409 }
      )
    }

    const customer = new Customer({
      name: body.name,
      username: derivedUsername,
      email: body.email,
      phone: body.phone,
      password: body.password,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      country: body.country || 'India',
      gstNumber: body.gstNumber,
    })

    await customer.save()

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
