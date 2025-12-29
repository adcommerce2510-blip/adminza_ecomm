import mongoose from 'mongoose'

const WarehouseStockSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true
  },
  warehouseName: {
    type: String,
    default: 'Main Warehouse',
    index: true
  },
  availableStock: {
    type: Number,
    default: 0,
    min: 0
  },
  lastReceivedDate: {
    type: Date
  },
  lastSupplier: {
    type: String,
    trim: true
  },
  totalReceivedFromSupplier: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
})

// Compound index to ensure one record per product+warehouse
WarehouseStockSchema.index({ productId: 1, warehouseName: 1 }, { unique: true })

export default mongoose.models.WarehouseStock || mongoose.model('WarehouseStock', WarehouseStockSchema)





