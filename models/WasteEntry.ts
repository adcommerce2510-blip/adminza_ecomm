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
  }
}, {
  timestamps: true
})

export default mongoose.models.WasteEntry || mongoose.model('WasteEntry', WasteEntrySchema)

