import mongoose from 'mongoose'
import UserSchema from './User-schema'
export default mongoose.model('User', UserSchema)
