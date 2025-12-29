import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import WarehouseStock from '@/models/WarehouseStock'
import Product from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const searchParams = request.nextUrl.searchParams
    const warehouseName = searchParams.get('warehouseName') || 'Main Warehouse'
    const productId = searchParams.get('productId')
    
    let query: any = { warehouseName }
    if (productId) {
      query.productId = productId
    }
    
    const warehouseStocks = await WarehouseStock.find(query).sort({ productName: 1 })
    
    // If productId is specified, also get admin stock from Product
    if (productId) {
      const product = await Product.findById(productId)
      if (warehouseStocks.length > 0) {
        const stock = warehouseStocks[0]
        return NextResponse.json({
          success: true,
          data: {
            ...stock.toObject(),
            adminStock: product?.stock || 0
          }
        })
      }
    }
    
    // For list view, enrich with admin stock
    const enrichedStocks = await Promise.all(
      warehouseStocks.map(async (stock) => {
        const product = await Product.findById(stock.productId)
        return {
          ...stock.toObject(),
          adminStock: product?.stock || 0,
          difference: (product?.stock || 0) - stock.availableStock
        }
      })
    )
    
    return NextResponse.json({
      success: true,
      data: enrichedStocks
    })
  } catch (error) {
    console.error('Error fetching warehouse stock:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch warehouse stock' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    
    if (!body.productId || !body.productName) {
      return NextResponse.json(
        { success: false, error: 'Product ID and name are required' },
        { status: 400 }
      )
    }
    
    // If availableStock is negative, it means we're deducting
    const isDeduction = body.availableStock < 0
    const quantityToAdd = isDeduction ? Math.abs(body.availableStock) : (body.quantityAdded || 0)
    
    const warehouseStock = await WarehouseStock.findOneAndUpdate(
      {
        productId: body.productId,
        warehouseName: body.warehouseName || 'Main Warehouse'
      },
      {
        $set: {
          productId: body.productId,
          productName: body.productName,
          warehouseName: body.warehouseName || 'Main Warehouse',
          lastReceivedDate: body.lastReceivedDate || new Date(),
          lastSupplier: body.lastSupplier || undefined
        },
        $inc: {
          availableStock: body.availableStock || 0,
          totalReceivedFromSupplier: isDeduction ? 0 : quantityToAdd
        }
      },
      { upsert: true, new: true }
    )
    
    return NextResponse.json({
      success: true,
      data: warehouseStock
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating/updating warehouse stock:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update warehouse stock' },
      { status: 500 }
    )
  }
}

