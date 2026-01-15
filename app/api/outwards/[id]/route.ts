import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import OutwardEntry from '@/models/OutwardEntry'
import WarehouseStock from '@/models/WarehouseStock'
import EshopInventory from '@/models/EshopInventory'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    
    // Find the outward entry
    const outwardEntry = await OutwardEntry.findById(params.id)
    
    if (!outwardEntry) {
      return NextResponse.json(
        { success: false, error: 'Outward entry not found' },
        { status: 404 }
      )
    }
    
    // Restore stock to warehouse
    const warehouseStock = await WarehouseStock.findOne({
      productId: outwardEntry.productId,
      warehouseName: outwardEntry.warehouseName
    })
    
    if (warehouseStock) {
      warehouseStock.availableStock += outwardEntry.quantity
      await warehouseStock.save()
    }
    
    // Update customer inventory if it exists (reduce quantity)
    const customerInventory = await EshopInventory.findOne({
      productId: outwardEntry.productId,
      customerId: outwardEntry.customerId
    })
    
    if (customerInventory) {
      customerInventory.quantity = Math.max(0, (customerInventory.quantity || 0) - outwardEntry.quantity)
      customerInventory.lastUpdated = new Date()
      await customerInventory.save()
    }
    
    // Delete the outward entry
    await OutwardEntry.findByIdAndDelete(params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Outward entry deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting outward entry:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete outward entry' },
      { status: 500 }
    )
  }
}
