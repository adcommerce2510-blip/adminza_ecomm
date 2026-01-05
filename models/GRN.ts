import mongoose from 'mongoose'

const GRNSchema = new mongoose.Schema({
  grnNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  poNumber: {
    type: String,
    index: true
  },
  grnType: {
    type: String,
    enum: ['GRN_CREATED', 'DIRECT_GRN'],
    required: true
  },
  supplierName: {
    type: String
  },
  warehouseName: {
    type: String,
    default: 'Main Warehouse',
    required: true
  },
  location: {
    zone: String,
    rack: String,
    bin: String
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
      default: 0
    },
    receivedQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    acceptedQuantity: {
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
    customerAllocation: {
      customerId: String,
      customerName: String,
      quantity: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    warehouseQuantity: {
      type: Number,
      default: 0,
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
    enum: ['IN_WAREHOUSE', 'IN_TRANSIT', 'DISPATCHED', 'DELIVERED'],
    default: 'IN_WAREHOUSE'
  },
  customerId: {
    type: String
  },
  customerName: {
    type: String
  },
  dispatchQuantity: {
    type: Number,
    default: 0
  },
  transferDetails: {
    fromWarehouse: String,
    toWarehouse: String,
    quantity: Number,
    status: {
      type: String,
      enum: ['pending', 'in_transit', 'completed'],
      default: 'pending'
    }
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
delete mongoose.models.GRN

export default mongoose.models.GRN || mongoose.model('GRN', GRNSchema)



