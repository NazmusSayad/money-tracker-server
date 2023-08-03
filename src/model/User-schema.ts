import mongoose from 'mongoose'
import { createdAtSchema, emailSchema } from './_utils'
export interface UserType {
  _id: mongoose.Types.ObjectId
  createdAt: Date

  name: string
  username: string
  email: string
  avatar: string
  password: string
  isVerified: boolean

  passwordModifiedAt?: Date
  pendingEmail?: string
  recoverCode?: string
  verificationCode?: string
}

export default new mongoose.Schema<UserType>({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    match: [/^[a-zA-Z]{1,}(?: [a-zA-Z]+){0,2}$/, 'Enter a valid name.'],
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    unique: [true, 'Username already exists'],
    required: [true, 'User must have a username'],
    // @ts-ignore
    match: [/^[a-z0-9]+$/, 'Enter a valid username.'],
  },
  email: emailSchema(),
  avatar: {
    type: String,
    match: [/^https?:\/\//, 'Please enter a valid image url'],
  },
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
} as any)
