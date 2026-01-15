import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import OutwardEntry from '@/models/OutwardEntry'
import WarehouseStock from '@/models/WarehouseStock'
import EshopInventory from '@/models/EshopInventory'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const productId = searchParams.get('productId')
    const warehouseName = searchParams.get('warehouseName')
    const referenceNumber = searchParams.get('referenceNumber')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    let query: any = {}
    
    if (customerId) {
      query.customerId = customerId
    }
    
    if (productId) {
      query.productId = productId
    }
    
    if (warehouseName) {
      query.warehouseName = warehouseName
    }
    
    if (referenceNumber) {
      query.referenceNumber = referenceNumber
    }
    
    if (startDate || endDate) {
      query.outwardDate = {}
      if (startDate) {
        query.outwardDate.$gte = new Date(startDate)
      }
      if (endDate) {
        query.outwardDate.$lte = new Date(endDate)
      }
    }
    
    const outwardEntries = await OutwardEntry.find(query).sort({ outwardDate: -1 })
    
    return NextResponse.json({
      success: true,
      data: outwardEntries
    })
  } catch (error) {
    console.error('Error fetching outward entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch outward entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    if (!body.productId || !body.productName || !body.customerId || !body.customerName || !body.quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID, name, customer ID, name, and quantity are required' },
        { status: 400 }
      )
    }
    
    const warehouseName = body.warehouseName || 'Main Warehouse'
    const quantity = parseInt(body.quantity)
    
    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be a positive number' },
        { status: 400 }
      )
    }
    
    // Check if warehouse stock exists and has enough
    const warehouseStock = await WarehouseStock.findOne({
      productId: body.productId,
      warehouseName
    })
    
    if (!warehouseStock) {
      return NextResponse.json(
        { success: false, error: 'Product not found in warehouse stock' },
        { status: 404 }
      )
    }
    
    if (warehouseStock.availableStock < quantity) {
      return NextResponse.json(
        { success: false, error: `Insufficient stock in warehouse. Available: ${warehouseStock.availableStock}` },
        { status: 400 }
      )
    }
    
    // Calculate total amount if unit price is provided
    const unitPrice = parseFloat(body.unitPrice) || 0
    const totalAmount = unitPrice * quantity
    
    // Create outward entry
    const outwardEntry = new OutwardEntry({
      productId: body.productId,
      productName: body.productName,
      customerId: body.customerId,
      customerName: body.customerName,
      quantity,
      warehouseName,
      unitPrice,
      totalAmount,
      outwardDate: body.outwardDate ? new Date(body.outwardDate) : new Date(),
      outwardType: body.outwardType || 'offline_direct',
      referenceNumber: body.referenceNumber || '',
      notes: body.description || body.notes || '',
      recordedBy: body.recordedBy
    })
    
    await outwardEntry.save()
    
    // Deduct from warehouse stock
    warehouseStock.availableStock -= quantity
    await warehouseStock.save()
    
    // Optionally update EshopInventory if customer has inventory tracking for this product
    // Only update if customer already has an inventory entry for this product
    const existingInventory = await EshopInventory.findOne({
      productId: body.productId,
      customerId: body.customerId
    })
    
    if (existingInventory) {
      // Add to customer's inventory quantity
      existingInventory.quantity = (existingInventory.quantity || 0) + quantity
      existingInventory.lastUpdated = new Date()
      if (unitPrice > 0 && existingInventory.price === 0) {
        existingInventory.price = unitPrice
      }
      await existingInventory.save()
    }
    
    return NextResponse.json({
      success: true,
      data: outwardEntry
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating outward entry:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create outward entry' },
      { status: 500 }
    )
  }
}
