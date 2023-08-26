import mongoose from 'mongoose'
import { createdAtSchema, emailSchema } from './_utils'
import bcrypt from 'bcrypt'

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
    verificationCode: { type: String },
    recoverCode: { type: String },
    createdAt: createdAtSchema(),
  },
  {
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
      getSafeInfo() {
        if (!this) {
          throw new Error('Should set req.user at any previous middleware')
        }

        return this
      },

      async isPassMatched(password: string) {
        return Boolean(
          password && (await bcrypt.compare(password, this.password))
        )
      },

      async isVerifyCodeMatched(code: string) {
        if (!this.verificationCode) {
          throw new ReqError('No verification process running')
        }

        return Boolean(
          code && (await bcrypt.compare(code, this.verificationCode))
        )
      },

      async isRecoverCodeMatched(code: string) {
        if (!this.recoverCode) {
          throw new ReqError('No recover process running')
        }

        return Boolean(code && (await bcrypt.compare(code, this.recoverCode)))
      },
    },
  }
)
