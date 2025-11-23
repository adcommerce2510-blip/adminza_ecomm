import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: string
  category: string
  subcategory?: string
  level2Category?: string
  price: number // Keep for backward compatibility
  mrp: number // Maximum Retail Price
  offerPrice: number // Offer/Selling Price
  gstPercentage: number // GST percentage
  discount: number // Calculated: MRP - Offer Price
  finalPrice: number // Calculated: Offer Price + (Offer Price * GST / 100)
  stock: number
  description: string
  hslCode?: string
  images: string[]
  vendor: string
  status: 'Active' | 'Inactive' | 'Out of Stock'
  createdAt: Date
  updatedAt: Date
  orders: number
  featured: boolean
  tags: string[]
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
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
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: [0, 'MRP cannot be negative']
  },
  offerPrice: {
    type: Number,
    required: [true, 'Offer Price is required'],
    min: [0, 'Offer Price cannot be negative']
  },
  gstPercentage: {
    type: Number,
    required: [true, 'GST Percentage is required'],
    min: [0, 'GST Percentage cannot be negative'],
    max: [100, 'GST Percentage cannot exceed 100'],
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  finalPrice: {
    type: Number,
    default: 0,
    min: [0, 'Final Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  hslCode: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  vendor: {
    type: String,
    required: [true, 'Vendor is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Out of Stock'],
    default: 'Active'
  },
  orders: {
    type: Number,
    default: 0,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
})

// Calculate discount and final price before saving
ProductSchema.pre('save', function(next) {
  const doc = this as any
  
  // Calculate discount: MRP - Offer Price
  if (doc.mrp && doc.offerPrice) {
    doc.discount = doc.mrp - doc.offerPrice
  }
  
  // Calculate final price: Offer Price + (Offer Price * GST / 100)
  if (doc.offerPrice && doc.gstPercentage !== undefined) {
    const gstAmount = (doc.offerPrice * doc.gstPercentage) / 100
    doc.finalPrice = doc.offerPrice + gstAmount
  }
  
  // Update status based on stock
  if (doc.stock === 0) {
    doc.status = 'Out of Stock'
  } else if (doc.status === 'Out of Stock' && doc.stock > 0) {
    doc.status = 'Active'
  }
  next()
})

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

