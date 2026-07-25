import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { isObjectId, toSlug } from '@/lib/slug'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect()

    const { slug } = params
    const decodedSlug = decodeURIComponent(slug)

    let product = null
    if (isObjectId(decodedSlug)) {
      product = await Product.findById(decodedSlug)
    }

    if (!product) {
      const products = await Product.find({ status: 'active' }).lean()
      product = products.find((p: any) => toSlug(p.name) === toSlug(decodedSlug)) || null
    }

    // Fallback: ignore status for older records
    if (!product) {
      const products = await Product.find({}).lean()
      product = products.find((p: any) => toSlug(p.name) === toSlug(decodedSlug)) || null
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
