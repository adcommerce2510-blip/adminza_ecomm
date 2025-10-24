import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import SubCategory from '@/models/SubCategory'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const subCategories = await SubCategory.find().sort({ createdAt: -1 })
    return NextResponse.json({
      success: true,
      data: subCategories
    })
  } catch (error) {
    console.error('Error fetching sub-categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sub-categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const subCategory = new SubCategory(body)
    await subCategory.save()
    
    return NextResponse.json({
      success: true,
      data: subCategory
    })
  } catch (error) {
    console.error('Error creating sub-category:', error)
    return NextResponse.json(
      { error: 'Failed to create sub-category' },
      { status: 500 }
    )
  }
}
