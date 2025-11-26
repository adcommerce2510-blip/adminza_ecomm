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
  quotationNo: {
    type: String,
    unique: true,
    sparse: true // Allow multiple null values, but enforce uniqueness for non-null values
  },
  notes: String,
  userResponse: {
    type: String,
    enum: ['accepted', 'rejected', 're-quote'],
    default: null
  },
  requoteMessage: String
}, {
  timestamps: true,
  collection: 'quotations'
})

// Pre-save hook to ensure quotationNo is ALWAYS set sequentially
QuotationSchema.pre('save', async function(next) {
  const doc = this as any
  // If quotationNo is null, undefined, or empty, generate a sequential one
  if (!doc.quotationNo || doc.quotationNo.trim() === '') {
    try {
      // Get all quotations with quotationNo to find the highest number
      const QuotationModel = this.constructor as any
      const quotations = await QuotationModel.find({
        quotationNo: { $exists: true, $ne: null, $regex: /^QUO-\d+$/ }
      }).select('quotationNo').lean()
      
      let maxNumber = 0
      
      // Extract numeric part from each quotationNo and find the maximum
      quotations.forEach((quotation: any) => {
        if (quotation.quotationNo) {
          const match = quotation.quotationNo.match(/^QUO-(\d+)$/)
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
      
      // Format as QUO-0001, QUO-0002, etc. (4 digits with leading zeros)
      doc.quotationNo = `QUO-${nextNumber.toString().padStart(4, '0')}`
    } catch (error) {
      console.error('Error generating quotation number in pre-save hook:', error)
      // Fallback: use timestamp if query fails
      const timestamp = Date.now()
      doc.quotationNo = `QUO-${timestamp.toString().slice(-4)}`
    }
  }
  next()
})

// Delete existing model to avoid caching issues
if (mongoose.models.Quotation) {
  delete mongoose.models.Quotation
}

export default mongoose.model('Quotation', QuotationSchema)

