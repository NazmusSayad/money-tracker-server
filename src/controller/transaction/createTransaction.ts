import mongoose from 'mongoose'
import { Types } from 'extrass'
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
    category: IDOptional,
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

function parseSchema(type: string, rawBody, safe: boolean = false) {
  const schema = schemas[type]
  if (!schema) {
    throw new Error('Invalid transaction type')
  }

  return safe ? schema.filter(rawBody) : schema.parse(rawBody)
}

export async function create(rawBody) {
  const body = parseSchema(rawBody.type, rawBody)
  return Transaction.create(body)
}

export async function update(
  _id: string,
  user: mongoose.Types.ObjectId,
  rawBody
) {
  const transaction = await Transaction.findOne({ user, _id })
  if (!transaction) {
    throw new ReqError('Transaction not found')
  }

  const body = parseSchema(transaction.type, rawBody, true)
  transaction.set(body)
  return transaction.save()
}
