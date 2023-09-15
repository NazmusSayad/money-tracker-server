import mongoose, { HydratedDocumentFromSchema, InferSchemaType } from 'mongoose'

export type UserType = InferSchemaType<typeof schema>
export type UserDoc = HydratedDocumentFromSchema<typeof schema>

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
})

export default mongoose.model('Category', schema)
export const categoryRypeSchema = r.object({
  name: r.string(),
  type: r.string('income', 'expense'),
  user: r.string(),
})
