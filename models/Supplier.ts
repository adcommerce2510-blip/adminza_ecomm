import mongoose from 'mongoose'

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  contact: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  pincode: {
    type: String,
    default: ''
  },
  gstNumber: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Clear the model cache to prevent recompilation issues
delete mongoose.models.Supplier

export default mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema)





