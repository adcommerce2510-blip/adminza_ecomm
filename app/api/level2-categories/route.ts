import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Level2Category from '@/models/Level2Category'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const level2Categories = await Level2Category.find().sort({ createdAt: -1 })
    return NextResponse.json({
      success: true,
      data: level2Categories
    })
  } catch (error) {
    console.error('Error fetching level2 categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch level2 categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const level2Category = new Level2Category(body)
    await level2Category.save()
    
    return NextResponse.json({
      success: true,
      data: level2Category
    })
  } catch (error) {
    console.error('Error creating level2 category:', error)
    return NextResponse.json(
      { error: 'Failed to create level2 category' },
      { status: 500 }
    )
  }
}

