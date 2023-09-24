import mongoose, { HydratedDocumentFromSchema, InferSchemaType } from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    select: false,
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense', 'transfer', 'loan', 'borrow'] as const,
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },

  pending: {
    type: Boolean,
    required: true,
    default: false,
  },

  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },

  note: {
    type: String,
    required: false,
  },

  // For Income & Expense
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },

  // For Transfer
  fees: {
    type: Number,
    required: false,
  },
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },

  // For Borrowing/Loan
  isPaid: {
    type: Boolean,
    required: false,
  },

  // For Taking Loan
  from: {
    type: String,
    required: false,
  },

  // For Giving Loan
  to: {
    type: String,
    required: false,
  },
})

export type TransactionDoc = HydratedDocumentFromSchema<typeof schema>
export type TransactionType = InferSchemaType<typeof schema>
export default mongoose.model('transaction', schema)
