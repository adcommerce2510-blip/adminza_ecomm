import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    // Return empty array for now as there's no Customer model yet
    return NextResponse.json({
      success: true,
      data: []
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
