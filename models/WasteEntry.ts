import mongoose from 'mongoose'

const WasteEntrySchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  supplierName: {
    type: String,
    default: ''
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  warehouseName: {
    type: String,
    default: 'Main Warehouse'
  },
  reason: {
    type: String,
    enum: ['damaged', 'expired', 'lost', 'other'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  recordedBy: {
    type: String
  },
  grnBatchId: {
    type: String,
    ref: 'GRN'
  },
  adjustmentType: {
    type: String,
    enum: ['from_grn', 'post_grn'],
    default: 'from_grn'
  },
  status: {
    type: String,
    enum: ['WASTED', 'ADJUSTED'],
    default: 'WASTED'
  }
}, {
  timestamps: true
})

export default mongoose.models.WasteEntry || mongoose.model('WasteEntry', WasteEntrySchema)

