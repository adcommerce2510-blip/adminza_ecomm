import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import RetopUpHistory from '@/models/RetopUpHistory'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    
    // Validate required fields
    if (!body.customerId || !body.customerName || !body.products || !Array.isArray(body.products)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const retopUpHistory = new RetopUpHistory({
      customerId: body.customerId,
      customerName: body.customerName,
      products: body.products,
      notes: body.notes || '',
      date: body.date || new Date()
    })

    await retopUpHistory.save()

    return NextResponse.json({
      success: true,
      data: retopUpHistory
    })
  } catch (error: any) {
    console.error('Error creating retop up history:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create retop up history' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    let query: any = {}
    if (customerId) {
      query.customerId = customerId
    }

    const history = await RetopUpHistory.find(query).sort({ date: -1 })

    return NextResponse.json({
      success: true,
      data: history
    })
  } catch (error: any) {
    console.error('Error fetching retop up history:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch retop up history' },
      { status: 500 }
    )
  }
}


