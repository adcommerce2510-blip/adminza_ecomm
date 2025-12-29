import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EshopInventory from '@/models/EshopInventory'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const inventory = await EshopInventory.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: inventory
    })
  } catch (error: any) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    // Check if product already exists for this customer
    const existing = await EshopInventory.findOne({
      productId: body.productId,
      customerId: body.customerId
    })
    
    if (existing) {
      // Update existing inventory - add to quantity
      existing.quantity = (existing.quantity || 0) + (body.quantity || 0)
      existing.lastUpdated = new Date()
      if (body.price) existing.price = body.price
      if (body.notes) existing.notes = (existing.notes || '') + (existing.notes ? '; ' : '') + body.notes
      await existing.save()
      
      return NextResponse.json({
        success: true,
        data: existing
      })
    } else {
      // Create new inventory item
    const inventoryItem = new EshopInventory(body)
    await inventoryItem.save()
    
    return NextResponse.json({
      success: true,
      data: inventoryItem
    })
    }
  } catch (error: any) {
    console.error('Error creating/updating inventory item:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}
