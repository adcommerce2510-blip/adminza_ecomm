import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  userId: { type: String },
  userEmail: { type: String, required: true },
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Order Placed' },
  shippingAddress: {
    receiverName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: String,
  company: String,
  gstNumber: String,
  notes: String,
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)

