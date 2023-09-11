import { Types } from 'extrass'
import mongoose from 'mongoose'
import Transaction, { TransactionType } from '../../model/Transaction'
const ID = r.or(r.string(), r.instance(mongoose.Types.ObjectId))
const IDOptional = r.o.or(r.string(), r.instance(mongoose.Types.ObjectId))

const commonSchema = {
  user: ID,
  type: r.string('income', 'expense', 'transfer', 'loan', 'borrow'),

  date: r.o.string(),
  amount: r.number(),

  account: IDOptional,
  pending: r.o.boolean(),
  note: r.o.string(),
}

const schemas: {
  [k in TransactionType['type']]: Types
} = {
  income: r.object({
    ...commonSchema,
    category: IDOptional,
  }),

  expense: r.object({
    ...commonSchema,
    category: ID,
  }),

  loan: r.object({
    ...commonSchema,
    to: r.string(),
  }),

  borrow: r.object({
    ...commonSchema,
    from: r.string(),
  }),

  transfer: r.object({
    ...commonSchema,
    fees: r.number().default(0),
    fromAccount: ID,
    toAccount: ID,
  }),
}

export default async function create(rawBody) {
  const type = rawBody.type as TransactionType['type']
  const schema = schemas[type]
  if (!schema) {
    throw new Error('Invalid transaction type')
  }

  const body = schema.parse(rawBody)
  console.log(body)
  return Transaction.create(body)
}
