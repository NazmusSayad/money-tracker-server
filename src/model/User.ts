import env from '../env'
import schema from './User-schema'
import bcrypt from 'bcrypt'
import mongoose, { HydratedDocumentFromSchema, InferSchemaType } from 'mongoose'

export type UserType = InferSchemaType<typeof schema>
export type UserDoc = HydratedDocumentFromSchema<typeof schema>

type PassPreSaveHelper = UserDoc & { _verificationCode; _recoverCode }

schema.pre('save', async function (this: PassPreSaveHelper, next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, env.BCRYPT_SALT_ROUND)

    if (!this.isNew) {
      this.passwordModifiedAt = new Date()
    }
  }

  if (this.verificationCode && this.isModified('verificationCode')) {
    this._verificationCode = this.verificationCode

    this.verificationCode = await bcrypt.hash(
      this.verificationCode,
      env.BCRYPT_SALT_ROUND_2
    )
  }

  if (this.recoverCode && this.isModified('recoverCode')) {
    this._recoverCode = this.recoverCode

    this.recoverCode = await bcrypt.hash(
      this.recoverCode,
      env.BCRYPT_SALT_ROUND_2
    )
  }

  next()
})

schema.post('save', function (this: PassPreSaveHelper) {
  if (this._verificationCode) {
    console.log('Verification OTP:', this._verificationCode)
  }

  if (this._recoverCode) {
    console.log('Recover OTP:', this._recoverCode)
  }
})

export default mongoose.model('User', schema)
