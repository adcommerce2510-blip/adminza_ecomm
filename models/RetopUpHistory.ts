import mongoose, { Document, Schema } from 'mongoose'

export interface IRetopUpHistory extends Document {
  customerId: string
  customerName: string
  products: Array<{
    productId: string
    productName: string
    previousQuantity: number
    quantityAdded: number
    newQuantity: number
    price: number
  }>
  notes: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

const RetopUpHistorySchema: Schema = new Schema({
  customerId: {
    type: String,
    required: [true, 'Customer ID is required']
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  products: [{
    productId: {
      type: String,
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    previousQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    quantityAdded: {
      type: Number,
      required: true,
      min: 0
    },
    newQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    _id: false
  }],
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'retopup_history'
})

export default mongoose.models.RetopUpHistory || mongoose.model<IRetopUpHistory>('RetopUpHistory', RetopUpHistorySchema)


