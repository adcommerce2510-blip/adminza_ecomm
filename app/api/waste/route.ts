import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WasteEntry from '@/models/WasteEntry'
import WarehouseStock from '@/models/WarehouseStock'
import PurchaseOrder from '@/models/PurchaseOrder'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')
    const warehouseName = searchParams.get('warehouseName') || 'Main Warehouse'
    
    let query: any = { warehouseName }
    if (productId) {
      query.productId = productId
    }
    
    const wasteEntries = await WasteEntry.find(query).sort({ date: -1 })
    
    return NextResponse.json({
      success: true,
      data: wasteEntries
    })
  } catch (error) {
    console.error('Error fetching waste entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch waste entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    if (!body.productId || !body.productName || !body.quantity || !body.reason) {
      return NextResponse.json(
        { success: false, error: 'Product ID, name, quantity, and reason are required' },
        { status: 400 }
      )
    }
    
    const warehouseName = body.warehouseName || 'Main Warehouse'
    
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
    
    if (warehouseStock.availableStock < body.quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock in warehouse' },
        { status: 400 }
      )
    }
    
    // Derive supplier name if not provided using last supplier from warehouse stock or linked PO (best-effort)
    let supplierName = body.supplierName || ''
    if (!supplierName) {
      if (warehouseStock.lastSupplier) {
        supplierName = warehouseStock.lastSupplier
      } else {
        // fallback: find latest PO for this product to infer supplier
        const latestPO = await PurchaseOrder.findOne({ 'items.productId': body.productId }).sort({ createdAt: -1 })
        if (latestPO?.supplierName) supplierName = latestPO.supplierName
      }
    }

    // Create waste entry
    const wasteEntry = new WasteEntry({
      productId: body.productId,
      productName: body.productName,
      quantity: body.quantity,
      warehouseName,
      supplierName,
      reason: body.reason,
      description: body.description || '',
      date: body.date || new Date(),
      recordedBy: body.recordedBy
    })
    
    await wasteEntry.save()
    
    // Deduct from warehouse stock
    warehouseStock.availableStock -= body.quantity
    await warehouseStock.save()
    
    return NextResponse.json({
      success: true,
      data: wasteEntry
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating waste entry:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create waste entry' },
      { status: 500 }
    )
  }
}

