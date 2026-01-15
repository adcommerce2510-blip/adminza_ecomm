import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import OutwardEntry from '@/models/OutwardEntry'
import EshopInventory from '@/models/EshopInventory'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    const outwardId = params.id
    const body = await request.json()
    
    // Find the outward entry
    const outwardEntry = await OutwardEntry.findById(outwardId)
    
    if (!outwardEntry) {
      return NextResponse.json(
        { success: false, error: 'Outward entry not found' },
        { status: 404 }
      )
    }
    
    // Check if it's a sample entry
    if (outwardEntry.outwardType !== 'sample') {
      return NextResponse.json(
        { success: false, error: 'Only sample entries can be converted to sale' },
        { status: 400 }
      )
    }
    
    // Check if already converted
    if (outwardEntry.convertedToSale) {
      return NextResponse.json(
        { success: false, error: 'This sample has already been converted to sale' },
        { status: 400 }
      )
    }
    
    // Get unit price from request body (required for conversion)
    const unitPrice = parseFloat(body.unitPrice)
    
    if (!unitPrice || unitPrice <= 0) {
      return NextResponse.json(
        { success: false, error: 'Unit price is required and must be greater than 0' },
        { status: 400 }
      )
    }
    
    const totalAmount = unitPrice * outwardEntry.quantity
    
    // Update outward entry: change type to offline_direct and add price
    outwardEntry.outwardType = 'offline_direct'
    outwardEntry.unitPrice = unitPrice
    outwardEntry.totalAmount = totalAmount
    outwardEntry.convertedToSale = true
    outwardEntry.convertedAt = new Date()
    
    // Update notes if provided
    if (body.notes) {
      outwardEntry.notes = (outwardEntry.notes || '') + `\n[Converted from sample on ${new Date().toLocaleString()}] ${body.notes}`
    } else {
      outwardEntry.notes = (outwardEntry.notes || '') + `\n[Converted from sample on ${new Date().toLocaleString()}]`
    }
    
    await outwardEntry.save()
    
    // Update or create EshopInventory entry for the customer
    let customerInventory = await EshopInventory.findOne({
      productId: outwardEntry.productId,
      customerId: outwardEntry.customerId
    })
    
    if (customerInventory) {
      // Update existing inventory
      customerInventory.quantity = (customerInventory.quantity || 0) + outwardEntry.quantity
      customerInventory.price = unitPrice // Update price
      customerInventory.lastUpdated = new Date()
      if (body.notes) {
        customerInventory.notes = (customerInventory.notes || '') + `\n[Sample converted to sale: ${body.notes}]`
      }
    } else {
      // Create new inventory entry
      customerInventory = new EshopInventory({
        productId: outwardEntry.productId,
        productName: outwardEntry.productName,
        customerId: outwardEntry.customerId,
        customerName: outwardEntry.customerName,
        quantity: outwardEntry.quantity,
        price: unitPrice,
        notes: body.notes ? `[Sample converted to sale: ${body.notes}]` : '[Sample converted to sale]'
      })
    }
    
    await customerInventory.save()
    
    return NextResponse.json({
      success: true,
      data: {
        outwardEntry,
        customerInventory
      },
      message: 'Sample successfully converted to sale and added to customer inventory'
    })
  } catch (error: any) {
    console.error('Error converting sample to sale:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to convert sample to sale' },
      { status: 500 }
    )
  }
}
