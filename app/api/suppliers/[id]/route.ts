import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Supplier from '@/models/Supplier'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const supplier = await Supplier.findById(params.id)
    
    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: supplier
    })
  } catch (error) {
    console.error('Error fetching supplier:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch supplier' },
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
    
    const supplier = await Supplier.findById(params.id)
    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }
    
    // Check if name is being changed and if it conflicts with another supplier
    if (body.name && body.name !== supplier.name) {
      const existingSupplier = await Supplier.findOne({ name: body.name })
      if (existingSupplier) {
        return NextResponse.json(
          { success: false, error: 'Supplier with this name already exists' },
          { status: 400 }
        )
      }
    }
    
    Object.assign(supplier, body)
    await supplier.save()
    
    return NextResponse.json({
      success: true,
      data: supplier
    })
  } catch (error: any) {
    console.error('Error updating supplier:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update supplier' },
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
    const supplier = await Supplier.findById(params.id)
    
    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found' },
        { status: 404 }
      )
    }
    
    await Supplier.findByIdAndDelete(params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete supplier' },
      { status: 500 }
    )
  }
}





