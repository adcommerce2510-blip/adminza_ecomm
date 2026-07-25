import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Service from '@/models/Service'
import { isObjectId, toSlug } from '@/lib/slug'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect()

    const { slug } = params
    const decodedSlug = decodeURIComponent(slug)

    let service = null
    if (isObjectId(decodedSlug)) {
      service = await Service.findById(decodedSlug)
    }

    if (!service) {
      const services = await Service.find({ status: 'active' }).lean()
      service = services.find((s: any) => toSlug(s.name) === toSlug(decodedSlug)) || null
    }

    if (!service) {
      const services = await Service.find({}).lean()
      service = services.find((s: any) => toSlug(s.name) === toSlug(decodedSlug)) || null
    }

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Error fetching service by slug:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}
