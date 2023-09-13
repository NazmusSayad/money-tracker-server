import env from '../env'
import bcrypt from 'bcrypt'
import schema from './User-schema'
import mongoose, { HydratedDocumentFromSchema, InferSchemaType } from 'mongoose'

export type UserDoc = HydratedDocumentFromSchema<typeof schema>
export type UserType = InferSchemaType<typeof schema>

schema.pre('save', async function (this, next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUND)

    if (!this.isNew) {
      this.passwordModifiedAt = new Date()
    }
  }

  next()
})

export default mongoose.model('User', schema)
