import mongoose from 'mongoose'

const OutwardEntrySchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true
  },
  customerId: {
    type: String,
    required: true,
    index: true
  },
  customerName: {
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
    default: 'Main Warehouse',
    index: true
  },
  unitPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  outwardDate: {
    type: Date,
    default: Date.now
  },
  outwardType: {
    type: String,
    enum: ['offline_direct', 'sample', 'return_replacement'],
    default: 'offline_direct'
  },
  referenceNumber: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  recordedBy: {
    type: String
  },
  convertedToSale: {
    type: Boolean,
    default: false
  },
  convertedAt: {
    type: Date
  }
}, {
  timestamps: true
})

export default mongoose.models.OutwardEntry || mongoose.model('OutwardEntry', OutwardEntrySchema)
