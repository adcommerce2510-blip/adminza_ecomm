import mongoose from 'mongoose'

const InwardEntrySchema = new mongoose.Schema({
  inwardNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  poNumber: {
    type: String,
    index: true
  },
  inwardType: {
    type: String,
    enum: ['PO_LINKED', 'DIRECT_INWARD'],
    required: true
  },
  supplierName: {
    type: String,
    required: true
  },
  receivedDate: {
    type: Date,
    default: Date.now,
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
    orderedQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    receivedQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    damagedQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    lostQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    acceptedQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    unitPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    _id: false
  }],
  status: {
    type: String,
    enum: ['PENDING_GRN', 'GRN_CREATED'],
    default: 'PENDING_GRN',
    index: true
  },
  grnLinks: [{
    type: String
  }],
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
delete mongoose.models.InwardEntry

const InwardEntry = mongoose.models.InwardEntry || mongoose.model('InwardEntry', InwardEntrySchema)

export default InwardEntry





