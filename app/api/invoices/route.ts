import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Invoice from '@/models/Invoice'

// Helper function to generate sequential invoice number
async function generateInvoiceNumber(): Promise<string> {
  try {
    // Get all invoices with invoiceNo to find the highest number
    const invoices = await Invoice.find({
      invoiceNo: { $exists: true, $ne: null, $regex: /^INV-\d+$/ }
    }).select('invoiceNo').lean()
    
    let maxNumber = 0
    
    // Extract numeric part from each invoiceNo and find the maximum
    invoices.forEach((invoice: any) => {
      if (invoice.invoiceNo) {
        const match = invoice.invoiceNo.match(/^INV-(\d+)$/)
        if (match) {
          const num = parseInt(match[1], 10)
          if (num > maxNumber) {
            maxNumber = num
          }
        }
      }
    })
    
    // Increment by 1
    const nextNumber = maxNumber + 1
    
    // Format as INV-0001, INV-0002, etc. (4 digits with leading zeros)
    return `INV-${nextNumber.toString().padStart(4, '0')}`
  } catch (error) {
    console.error('Error generating invoice number:', error)
    // Fallback: use timestamp if query fails
    const timestamp = Date.now()
    return `INV-${timestamp.toString().slice(-4)}`
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const nextNumber = searchParams.get('nextNumber') // New parameter to get next invoice number
    
    // If requesting next invoice number
    if (nextNumber === 'true') {
      const nextInvoiceNo = await generateInvoiceNumber()
      return NextResponse.json({
        success: true,
        nextInvoiceNo: nextInvoiceNo
      })
    }
    
    let query: any = {}
    
    if (customerId) {
      query.customerId = customerId
    }
    
    if (startDate && endDate) {
      query.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }
    
    const invoices = await Invoice.find(query).sort({ invoiceDate: -1 })
    
    return NextResponse.json({
      success: true,
      data: invoices
    })
  } catch (error: any) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    
    // Generate sequential invoice number if not provided
    let invoiceNo = body.invoiceNo
    if (!invoiceNo) {
      invoiceNo = await generateInvoiceNumber()
    } else {
      // Check if invoice with same invoiceNo already exists
      const existingInvoice = await Invoice.findOne({ invoiceNo: invoiceNo })
      if (existingInvoice) {
        // If exists, generate a new sequential number
        invoiceNo = await generateInvoiceNumber()
      }
    }
    
    const invoice = new Invoice({
      customerId: body.customerId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      customerCity: body.customerCity,
      customerState: body.customerState,
      customerZipCode: body.customerZipCode,
      customerGstNumber: body.customerGstNumber,
      invoiceNo: invoiceNo, // Use generated or provided invoice number
      invoiceDate: body.invoiceDate ? new Date(body.invoiceDate) : new Date(),
      items: body.items || [],
      subtotal: body.subtotal || 0,
      tax: body.tax,
      total: body.total,
      gstType: body.gstType || 'CGST/SGST',
      gstRate: body.gstRate || 18,
      additionalCharges: body.additionalCharges || [],
      orderId: body.orderId,
      orderNo: body.orderNo
    })
    
    await invoice.save()
    
    return NextResponse.json({
      success: true,
      data: invoice
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating invoice:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create invoice' },
      { status: 500 }
    )
  }
}

