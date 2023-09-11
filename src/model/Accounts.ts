import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { versionKey: false }
)

export default mongoose.model('Account', schema)