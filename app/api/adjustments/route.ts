import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WarehouseStock from '@/models/WarehouseStock'
import WasteEntry from '@/models/WasteEntry'
import GRN from '@/models/GRN'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const { grnBatchId, productId, productName, quantity, reason, description, warehouseName } = body
    
    if (!grnBatchId || !productId || !quantity || !reason) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate reason
    const validReasons = ['lost', 'expired', 'damaged', 'other']
    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reason. Must be: lost, expired, damaged, or other' },
        { status: 400 }
      )
    }
    
    // Find the GRN batch
    const grn = await GRN.findOne({ grnNumber: grnBatchId })
    if (!grn) {
      return NextResponse.json(
        { success: false, error: 'GRN batch not found' },
        { status: 404 }
      )
    }
    
    // Check available stock
    const stock = await WarehouseStock.findOne({
      productId,
      warehouseName: warehouseName || grn.warehouseName
    })
    
    if (!stock || stock.availableStock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock for adjustment' },
        { status: 400 }
      )
    }
    
    // Deduct stock
    await WarehouseStock.findOneAndUpdate(
      { productId, warehouseName: warehouseName || grn.warehouseName },
      { $inc: { availableStock: -quantity } }
    )
    
    // Create waste entry (post-GRN adjustment)
    const wasteEntry = new WasteEntry({
      productId,
      productName: productName || stock.productName,
      quantity,
      warehouseName: warehouseName || grn.warehouseName,
      supplierName: grn.supplierName || '',
      reason,
      description: description || `Post-GRN adjustment from batch ${grnBatchId}`,
      grnBatchId,
      adjustmentType: 'post_grn',
      status: 'ADJUSTED',
      date: new Date()
    })
    
    await wasteEntry.save()
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Stock adjusted successfully',
        wasteEntry,
        remainingStock: stock.availableStock - quantity
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error adjusting stock:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to adjust stock' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const grnBatchId = searchParams.get('grnBatchId')
    const adjustmentType = searchParams.get('adjustmentType')
    
    let query: any = { adjustmentType: 'post_grn' }
    if (grnBatchId) {
      query.grnBatchId = grnBatchId
    }
    if (adjustmentType) {
      query.adjustmentType = adjustmentType
    }
    
    const adjustments = await WasteEntry.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: adjustments
    })
  } catch (error) {
    console.error('Error fetching adjustments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch adjustments' },
      { status: 500 }
    )
  }
}






