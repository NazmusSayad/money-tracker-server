import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { createdAtSchema, emailSchema } from './_utils'
import { USER_SAFE_DATA_KEYS } from '../config'
import OTP, { OTPType } from './OTP'
import { generateOTP } from '../utils/otp'
import { UserDoc } from './User'

export default new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      match: [/^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$/, 'Enter a valid name.'],
    },
    avatar: {
      type: String,
      match: [/^https?:\/\//, 'Please enter a valid image url'],
    },

    email: { ...emailSchema(), required: true },
    password: {
      type: String,
      required: true,
    },
    passwordModifiedAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    pendingEmail: { ...emailSchema(), unique: false },
    createdAt: createdAtSchema(),
  },

  {
    versionKey: false,

    statics: {
      async checkEmailAvailability(email: string) {
        if (!email) throw new ReqError('Please provide an email')

        const count = await this.findOne({
          $or: [{ email }, { pendingEmail: email }],
        }).estimatedDocumentCount()

        if (count > 0) {
          throw new ReqError('Another account exists with this email')
        }
      },
    },

    methods: {
      createOTP(type: OTPType['type']) {
        return OTP.create({ user: this._id, type, code: generateOTP(6) })
      },

      getSafeInfo() {
        if (!this) {
          throw new Error('Should set req.user at any previous middleware')
        }

        const result: object = {}
        USER_SAFE_DATA_KEYS.forEach((key) => {
          result[key] = this[key]
        })

        return result as Pick<typeof this, (typeof USER_SAFE_DATA_KEYS)[number]>
      },

      async isPassMatched(password: string) {
        return Boolean(
          password && (await bcrypt.compare(password, this.password))
        )
      },

      checkRecoverCode: otpCodeMatchFactory('account-recover'),
      checkVerifyCode: otpCodeMatchFactory('email-verification'),
    },
  }
)

function otpCodeMatchFactory(
  type: OTPType['type']
): (code: string) => Promise<boolean> {
  return async function (this: UserDoc, code: string) {
    const hashes = await OTP.find({ user: this._id, type })
    if (!hashes?.length) {
      throw new ReqError('There is no running verification process')
    }

    for (let hash of hashes) {
      if (await bcrypt.compare(code, hash.code)) {
        hashes.forEach((hash) => hash.delete())
        return true
      }
    }

    throw new ReqError('Invalid otp provided', 401)
  }
}
