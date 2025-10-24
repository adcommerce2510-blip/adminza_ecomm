import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const subSubcategory = searchParams.get('subSubcategory')

    let query: any = {}

    // Build hierarchical category query with flexible matching
    if (subSubcategory && subcategory && category) {
      // Level 2 category - most specific
      const categoryPath = `${category}/${subcategory}/${subSubcategory}`
      const categoryPathWithSpaces = `${category.replace(/-/g, ' ')}/${subcategory.replace(/-/g, ' ')}/${subSubcategory.replace(/-/g, ' ')}`
      
      query = {
        $or: [
          { category: categoryPath },
          { category: categoryPathWithSpaces },
          { category: { $regex: categoryPath, $options: 'i' } },
          { category: { $regex: categoryPathWithSpaces, $options: 'i' } },
          // Handle URL slug format directly
          { category: { $regex: categoryPathWithSpaces.replace(/&/g, '&'), $options: 'i' } },
          { level2Category: subSubcategory, subcategory: subcategory, category: category }
        ]
      }
    } else if (subcategory && category) {
      // Subcategory level - flexible matching
      const categoryPath = `${category}/${subcategory}`
      const categoryPathWithSpaces = `${category.replace(/-/g, ' ')}/${subcategory.replace(/-/g, ' ')}`
      
      query = {
        $or: [
          { category: categoryPath },
          { category: categoryPathWithSpaces },
          { category: { $regex: categoryPath, $options: 'i' } },
          { category: { $regex: categoryPathWithSpaces, $options: 'i' } },
          // Handle URL slug format directly - convert hyphens to spaces and handle &
          { category: { $regex: categoryPathWithSpaces.replace(/&/g, '&'), $options: 'i' } },
          { subcategory: subcategory, category: category }
        ]
      }
    } else if (category) {
      // Main category level - flexible matching
      const categoryWithSpaces = category.replace(/-/g, ' ')
      
      query = {
        $or: [
          { category: category },
          { category: categoryWithSpaces },
          { category: { $regex: `^${category}`, $options: 'i' } },
          { category: { $regex: `^${categoryWithSpaces}`, $options: 'i' } }
        ]
      }
    }

    const products = await Product.find(query).sort({ createdAt: -1 })

    // Remove duplicates by _id
    const uniqueProducts = Array.from(new Map(products.map((item: any) => [item._id.toString(), item])).values())

    return NextResponse.json({
      success: true,
      data: uniqueProducts
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const product = new Product(body)
    await product.save()

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
