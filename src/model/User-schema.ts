import mongoose from 'mongoose'
import { createdAtSchema, emailSchema } from './_utils'
import bcrypt from 'bcrypt'

export default new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
      match: [/^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$/, 'Enter a valid name.'],
    },
    avatar: {
      type: String,
      match: [/^https?:\/\//, 'Please enter a valid image url'],
    },

    email: emailSchema(),
    password: {
      type: String,
      required: [true, 'User must have a password'],
    },
    passwordModifiedAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    pendingEmail: { ...emailSchema(), required: false, unique: false },
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
        return this
      },

      async isPassMatched(password: string) {
        return Boolean(
          password && (await bcrypt.compare(password, this.password))
        )
      },

      async isVerifyCodeMatched(code: string) {
        return Boolean(
          code && (await bcrypt.compare(code, this.verificationCode))
        )
      },

      async isRecoverCodeMatched(code: string) {
        return Boolean(code && (await bcrypt.compare(code, this.recoverCode)))
      },
    },
  }
)
