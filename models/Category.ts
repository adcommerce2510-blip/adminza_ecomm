import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mainUse: { type: String, required: true, enum: ['product', 'service'] },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)

