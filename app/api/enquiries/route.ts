import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Enquiry from '@/models/Enquiry'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    
    let query: any = {}
    if (email) {
      query.userEmail = email
    }
    
    const enquiries = await Enquiry.find(query).sort({ enquiryDate: -1 })
    
    return NextResponse.json({
      success: true,
      data: enquiries
    })
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const enquiry = new Enquiry(body)
    await enquiry.save()
    
    return NextResponse.json({
      success: true,
      data: enquiry
    })
  } catch (error) {
    console.error('Error creating enquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create enquiry' },
      { status: 500 }
    )
  }
}
