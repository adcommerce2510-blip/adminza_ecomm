import mongoose, { Document, Schema } from 'mongoose'

export interface IService extends Document {
  name: string
  category: string
  subcategory?: string
  level2Category?: string
  price: number
  duration: string
  description: string
  location: string
  vendor: string
  status: 'Active' | 'Inactive'
  rating: number
  orders: number
  createdAt: Date
  updatedAt: Date
  images: string[]
  features: string[]
  requirements: string[]
}

const ServiceSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  level2Category: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  vendor: {
    type: String,
    required: [true, 'Vendor is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  orders: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    type: String
  }],
  features: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)

