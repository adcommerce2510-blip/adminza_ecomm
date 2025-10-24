import mongoose from 'mongoose'

const QuotationSchema = new mongoose.Schema({
  userId: String,
  userEmail: {
    type: String,
    required: [true, 'User email is required']
  },
  userName: String,
  userPhone: String,
  userAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    _id: false
  },
  items: [{
    itemId: String,
    itemName: String,
    quantity: Number,
    price: Number,
    _id: false
  }],
  totalAmount: Number,
  description: String,
  company: String,
  gstNumber: String,
  status: {
    type: String,
    default: 'pending'
  },
  quotationDate: {
    type: Date,
    default: Date.now
  },
  notes: String
}, {
  timestamps: true,
  collection: 'quotations'
})

// Delete existing model to avoid caching issues
if (mongoose.models.Quotation) {
  delete mongoose.models.Quotation
}

export default mongoose.model('Quotation', QuotationSchema)

