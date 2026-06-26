import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Service from '@/models/Service'

function slugToNameRegex(slug: string): RegExp {
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

    let service = null
    if (/^[a-f\d]{24}$/i.test(slug)) {
      service = await Service.findById(slug)
    }

    if (!service) {
      const nameRegex = slugToNameRegex(slug)
      service = await Service.findOne({ name: nameRegex, status: 'active' })
    }

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error('Error fetching service by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}
