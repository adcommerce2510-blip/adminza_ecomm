import mongoose, { Document, Schema } from 'mongoose'

export interface IInvoice extends Document {
  customerId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  customerState?: string
  customerZipCode?: string
  customerGstNumber?: string
  invoiceNo: string
  invoiceDate: Date
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
    hslCode?: string
  }>
  subtotal: number
  tax?: number
  total?: number
  gstType?: 'CGST/SGST' | 'IGST'
  gstRate?: number
  additionalCharges?: Array<{
    name: string
    amount: number
  }>
  orderId?: string
  orderNo?: string
  createdAt?: Date
  updatedAt?: Date
}

const InvoiceSchema: Schema = new Schema({
  customerId: { type: String },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  customerAddress: { type: String },
  customerCity: { type: String },
  customerState: { type: String },
  customerZipCode: { type: String },
  customerGstNumber: { type: String },
  invoiceNo: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true, default: Date.now },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    hslCode: { type: String }
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number },
  total: { type: Number },
  gstType: { type: String, enum: ['CGST/SGST', 'IGST'], default: 'CGST/SGST' },
  gstRate: { type: Number, default: 18 },
  additionalCharges: [{
    name: { type: String },
    amount: { type: Number }
  }],
  orderId: { type: String },
  orderNo: { type: String }
}, {
  timestamps: true,
  collection: 'invoices'
})

// Pre-save hook to ensure invoiceNo is ALWAYS set (never null)
// Note: For sequential numbering, invoiceNo should be set before save via API
// This is a fallback in case invoiceNo is somehow missing
InvoiceSchema.pre('save', async function(next) {
  const doc = this as any
  // If invoiceNo is null, undefined, or empty, generate a sequential one
  if (!doc.invoiceNo || doc.invoiceNo.trim() === '') {
    try {
      // Get all invoices with invoiceNo to find the highest number
      const InvoiceModel = this.constructor as any
      const invoices = await InvoiceModel.find({
        invoiceNo: { $exists: true, $ne: null, $regex: /^INV-\d+$/ }
      }).select('invoiceNo').lean()
      
      let maxNumber = 0
      
      // Extract numeric part from each invoiceNo and find the maximum
      invoices.forEach((invoice: any) => {
        if (invoice.invoiceNo) {
          const match = invoice.invoiceNo.match(/^INV-(\d+)$/)
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
      
      // Format as INV-0001, INV-0002, etc. (4 digits with leading zeros)
      doc.invoiceNo = `INV-${nextNumber.toString().padStart(4, '0')}`
    } catch (error) {
      console.error('Error generating invoice number in pre-save hook:', error)
      // Fallback: use timestamp if query fails
      const timestamp = Date.now()
      doc.invoiceNo = `INV-${timestamp.toString().slice(-4)}`
    }
  }
  next()
})

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema)

