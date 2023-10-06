import env from '../env'
import bcrypt from 'bcrypt'
import mongoose, { HydratedDocumentFromSchema, InferSchemaType } from 'mongoose'
import User from './User'
import axios from 'axios'

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

schema.post('save', async function (this: PreSaveHelper) {
  try {
    const user = await User.findById(this.user)
    if (!user) return

    await axios.post(
      'https://smtp.sayad.dev/api/no-reply',
      {
        to: user.email,
        subject: 'Money Tracker OTP',
        html: `<h1>OTP Code</h1><p>${this._tempCode}</p>`,
      },
      {
        headers: { secret: env.SMTP_SECRET },
      }
    )
  } catch (err) {
    console.error('Unable to sent email:', err)
  }
})

schema.index({ user: 1, type: 1 })
export default mongoose.model('OTP', schema)
