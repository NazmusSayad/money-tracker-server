import mongoose from 'mongoose'
import { createdAtSchema, emailSchema } from './_utils'

export default new mongoose.Schema({
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
})
