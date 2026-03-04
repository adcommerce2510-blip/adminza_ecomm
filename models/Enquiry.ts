import mongoose from 'mongoose'

const EnquirySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: String,
  company: String,
  itemId: String,
  itemType: { type: String, enum: ['product', 'service', 'contact'], required: true },
  itemName: { type: String, required: true },
  message: { type: String, required: true },
  phone: String,
  preferredContactMethod: { type: String, enum: ['email', 'phone', 'whatsapp'], default: 'email' },
  status: { type: String, enum: ['pending', 'viewed', 'responded', 'closed'], default: 'pending' },
  enquiryDate: { type: Date, default: Date.now },
  responseNotes: String
}, { timestamps: true })

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema)

