import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

// Helper: convert slug back to a regex that can match the original name
function slugToNameRegex(slug: string): RegExp {
  // Replace hyphens with spaces or hyphens
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

    // First try to find by _id (backward compat for 24-char hex ids)
    let product = null
    if (/^[a-f\d]{24}$/i.test(slug)) {
      product = await Product.findById(slug)
    }

    // Fallback: find by name slug match
    if (!product) {
      const nameRegex = slugToNameRegex(slug)
      product = await Product.findOne({ name: nameRegex, status: 'active' })
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
