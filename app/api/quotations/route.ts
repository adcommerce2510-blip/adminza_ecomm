import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Quotation from '@/models/Quotation'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    
    let query: any = {}
    if (email) {
      query.userEmail = email
    }
    
    const quotations = await Quotation.find(query).sort({ quotationDate: -1 })
    
    return NextResponse.json({
      success: true,
      data: quotations
    })
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/quotations: Starting quotation creation')
    
    await dbConnect()
    console.log('Database connected')
    
    const body = await request.json()
    
    console.log('Request body received:', {
      userEmail: body.userEmail,
      userName: body.userName,
      itemsCount: body.items?.length,
      totalAmount: body.totalAmount,
      status: body.status
    })
    
    // Validate required fields
    if (!body.userEmail) {
      throw new Error('User email is required')
    }
    
    // Convert quotationDate string to Date if it's a string
    let quotationDate = body.quotationDate
    if (typeof quotationDate === 'string') {
      quotationDate = new Date(quotationDate)
    }
    
    const quotationData = {
      userEmail: body.userEmail,
      userName: body.userName || 'Guest',
      userPhone: body.userPhone || '',
      userAddress: body.userAddress || {},
      items: body.items || [],
      totalAmount: body.totalAmount || 0,
      description: body.description || '',
      company: body.company || '',
      gstNumber: body.gstNumber || '',
      status: body.status || 'pending',
      quotationDate: quotationDate || new Date()
    }
    
    console.log('Creating quotation document with:', quotationData)
    
    const quotation = new Quotation(quotationData)
    
    console.log('Quotation document created, now saving...')
    await quotation.save()
    
    console.log('Quotation saved successfully with ID:', quotation._id)
    
    return NextResponse.json({
      success: true,
      data: quotation
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating quotation:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error details:', errorMessage)
    
    return NextResponse.json(
      { 
        error: `Failed to create quotation: ${errorMessage}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
