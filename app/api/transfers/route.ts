import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WarehouseStock from '@/models/WarehouseStock'
import GRN from '@/models/GRN'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const { grnBatchId, fromWarehouse, toWarehouse, quantity, productId, productName } = body
    
    if (!grnBatchId || !fromWarehouse || !toWarehouse || !quantity || !productId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
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
    
    // Check available stock in source warehouse
    const sourceStock = await WarehouseStock.findOne({
      productId,
      warehouseName: fromWarehouse
    })
    
    if (!sourceStock || sourceStock.availableStock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock in source warehouse' },
        { status: 400 }
      )
    }
    
    // Update source warehouse (mark as IN_TRANSIT)
    await WarehouseStock.findOneAndUpdate(
      { productId, warehouseName: fromWarehouse },
      {
        $inc: { availableStock: -quantity },
        $set: { status: 'IN_TRANSIT' }
      }
    )
    
    // Update or create destination warehouse stock
    await WarehouseStock.findOneAndUpdate(
      { productId, warehouseName: toWarehouse },
      {
        $inc: { availableStock: quantity },
        $set: {
          productName,
          grnBatchId,
          status: 'IN_WAREHOUSE',
          lastReceivedDate: new Date()
        }
      },
      { upsert: true, new: true }
    )
    
    // Update GRN transfer details
    grn.transferDetails = {
      fromWarehouse,
      toWarehouse,
      quantity,
      status: 'in_transit'
    }
    await grn.save()
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Transfer initiated successfully',
        transfer: {
          grnBatchId,
          fromWarehouse,
          toWarehouse,
          quantity,
          status: 'in_transit'
        }
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error initiating transfer:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initiate transfer' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    const { grnBatchId, status } = body
    
    if (!grnBatchId || status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }
    
    // Find the GRN batch
    const grn = await GRN.findOne({ grnNumber: grnBatchId })
    if (!grn || !grn.transferDetails) {
      return NextResponse.json(
        { success: false, error: 'Transfer not found' },
        { status: 404 }
      )
    }
    
    // Update transfer status to completed
    grn.transferDetails.status = 'completed'
    grn.status = 'IN_WAREHOUSE'
    await grn.save()
    
    // Update destination warehouse stock status
    await WarehouseStock.updateMany(
      { grnBatchId, warehouseName: grn.transferDetails.toWarehouse },
      { $set: { status: 'IN_WAREHOUSE' } }
    )
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Transfer completed successfully',
        grn
      }
    })
  } catch (error: any) {
    console.error('Error completing transfer:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to complete transfer' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const warehouse = searchParams.get('warehouse')
    
    let query: any = { 'transferDetails.status': { $exists: true } }
    if (warehouse) {
      query.$or = [
        { 'transferDetails.fromWarehouse': warehouse },
        { 'transferDetails.toWarehouse': warehouse }
      ]
    }
    
    const transfers = await GRN.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      data: transfers
    })
  } catch (error) {
    console.error('Error fetching transfers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transfers' },
      { status: 500 }
    )
  }
}







