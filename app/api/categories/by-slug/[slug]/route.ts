import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/models/Category'
import SubCategory from '@/models/SubCategory'
import Level2Category from '@/models/Level2Category'

function slugToNameRegex(slug: string): RegExp {
  // If slug is 'printing-solutions', it could match 'Printing Solutions' or 'printing solutions'
  const escaped = slug.replace(/-/g, '[\\s\\-]')
  return new RegExp(`^${escaped}$`, 'i')
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect()
    const { slug } = params
    const nameRegex = slugToNameRegex(slug)

    // Check Categories
    const category = await Category.findOne({ name: nameRegex })
    if (category) {
      return NextResponse.json({
        success: true,
        type: 'category',
        mainUse: category.mainUse,
        category: category.name
      })
    }

    // Check SubCategories
    const subCategory = await SubCategory.findOne({ name: nameRegex })
    if (subCategory) {
      return NextResponse.json({
        success: true,
        type: 'subcategory',
        mainUse: subCategory.mainUse,
        category: subCategory.mainCategory,
        subcategory: subCategory.name
      })
    }

    // Check Level2Categories
    const level2 = await Level2Category.findOne({ name: nameRegex })
    if (level2) {
        return NextResponse.json({
        success: true,
        type: 'level2',
        mainUse: level2.mainUse,
        category: level2.mainCategory,
        subcategory: level2.subCategory,
        subSubcategory: level2.name
      })
    }

    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching by slug:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
