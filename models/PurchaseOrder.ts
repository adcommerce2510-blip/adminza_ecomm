import mongoose from 'mongoose'

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  supplierName: {
    type: String,
    required: true
  },
  items: [{
    productId: {
      type: String,
      required: true
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
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    _id: false
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryType: {
    type: String,
    enum: ['to_warehouse', 'direct_to_customer'],
    required: true
  },
  customerId: {
    type: String
  },
  customerName: {
    type: String
  },
  expectedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'received', 'reached', 'cancelled'],
    default: 'pending'
  },
  receivedQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String
  }
}, {
  timestamps: true
})

// Clear the model cache to prevent recompilation issues
delete mongoose.models.PurchaseOrder

export default mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', PurchaseOrderSchema)

