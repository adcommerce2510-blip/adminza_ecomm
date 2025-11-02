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
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const inventoryItem = new EshopInventory(body)
    await inventoryItem.save()
    
    return NextResponse.json({
      success: true,
      data: inventoryItem
    })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}
