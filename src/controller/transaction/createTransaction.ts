import mongoose from 'mongoose'
import { TypeObject, TypeSchemaUnion } from 'rype'
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
  [k in TransactionType['type']]: TypeSchemaUnion
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
    isPaid: r.boolean().default(false),
    to: r.string(),
  }),

  borrow: r.object({
    ...commonSchema,
    isPaid: r.boolean().default(false),
    from: r.string(),
  }),

  transfer: r.object({
    ...commonSchema,
    fees: r.number().default(0),
    fromAccount: ID,
    toAccount: ID,
  }),
}

function getSchema(type: string) {
  const schema = schemas[type]
  if (!schema) {
    throw new Error('Invalid transaction type')
  }

  return schema as TypeObject
}

export async function create(rawBody) {
  return Transaction.create(getSchema(rawBody.type).parse(rawBody))
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

  const schema = getSchema(transaction.type).omit('user').partial()
  console.log(schema.parse(rawBody))
  transaction.set(schema.parse(rawBody))
  return transaction.save()
}
