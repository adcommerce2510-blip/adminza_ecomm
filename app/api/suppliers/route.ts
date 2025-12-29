import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Supplier from '@/models/Supplier'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('isActive')
    
    let query: any = {}
    if (isActive !== null) {
      query.isActive = isActive === 'true'
    }
    
    const suppliers = await Supplier.find(query).sort({ name: 1 })
    
    return NextResponse.json({
      success: true,
      data: suppliers
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch suppliers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Supplier name is required' },
        { status: 400 }
      )
    }
    
    // Check if supplier with same name already exists
    const existingSupplier = await Supplier.findOne({ name: body.name })
    if (existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier with this name already exists' },
        { status: 400 }
      )
    }
    
    const supplier = new Supplier({
      name: body.name,
      contact: body.contact || '',
      email: body.email || '',
      phone: body.phone || '',
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      pincode: body.pincode || '',
      gstNumber: body.gstNumber || '',
      notes: body.notes || '',
      isActive: body.isActive !== undefined ? body.isActive : true
    })
    
    await supplier.save()
    
    return NextResponse.json({
      success: true,
      data: supplier
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create supplier' },
      { status: 500 }
    )
  }
}





