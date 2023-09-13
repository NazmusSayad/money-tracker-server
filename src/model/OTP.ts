import env from '../env'
import bcrypt from 'bcrypt'
import mongoose, { HydratedDocumentFromSchema, InferSchemaType } from 'mongoose'

export type OTPDoc = HydratedDocumentFromSchema<typeof schema>
export type OTPType = InferSchemaType<typeof schema>
type PreSaveHelper = OTPDoc & { _tempCode: string }

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['account-recover', 'email-verification'] as const,
  },
  code: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
    default: Date.now,
    select: false,
    expires: 60 * 20 /* 60 seconds * 20 = 20 Minutes */,
  },
})

schema.pre('save', async function (this: PreSaveHelper, next) {
  if (this.isNew) {
    this._tempCode = this.code
    this.code = await bcrypt.hash(this.code, env.BCRYPT_SALT_ROUND_2)
  }

  next()
})

schema.post('save', function (this: PreSaveHelper) {
  console.log(this.type, 'code:', this._tempCode)
})

export default mongoose.model('OTP', schema)
