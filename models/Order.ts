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
  orderDate: { type: Date, default: Date.now },
  orderNo: {
    type: String,
    unique: true,
    sparse: true
  }
}, { timestamps: true })

// Pre-save hook to ensure orderNo is ALWAYS set (never null)
// Note: For sequential numbering, orderNo should be set before save via API
// This is a fallback in case orderNo is somehow missing
OrderSchema.pre('save', async function(next) {
  const doc = this as any
  // If orderNo is null, undefined, or empty, generate a sequential one
  if (!doc.orderNo || doc.orderNo.trim() === '') {
    try {
      // Get all orders with orderNo to find the highest number
      const OrderModel = this.constructor as any
      const orders = await OrderModel.find({
        orderNo: { $exists: true, $ne: null, $regex: /^ORD-\d+$/ }
      }).select('orderNo').lean()
      
      let maxNumber = 0
      
      // Extract numeric part from each orderNo and find the maximum
      orders.forEach((order: any) => {
        if (order.orderNo) {
          const match = order.orderNo.match(/^ORD-(\d+)$/)
          if (match) {
            const num = parseInt(match[1], 10)
            if (num > maxNumber) {
              maxNumber = num
            }
          }
        }
      })
      
      // Increment by 1
      const nextNumber = maxNumber + 1
      
      // Format as ORD-0001, ORD-0002, etc. (4 digits with leading zeros)
      doc.orderNo = `ORD-${nextNumber.toString().padStart(4, '0')}`
    } catch (error) {
      console.error('Error generating order number in pre-save hook:', error)
      // Fallback: use timestamp if query fails
      const timestamp = Date.now()
      doc.orderNo = `ORD-${timestamp.toString().slice(-4)}`
    }
  }
  next()
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)

