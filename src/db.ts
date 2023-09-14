import mongoose from 'mongoose'
import env from './env'
const uri = env.DB_URL.replace('<password>', env.DB_PASS)

mongoose.set('strictQuery', false)
mongoose.plugin((schema) => {
  schema.set('versionKey', false)
})

mongoose
  .connect(uri)
  .then(() => {
    console.log('>>>', 'MongoDB connected successfully...')
  })
  .catch(() => {
    console.error('!!!', 'MongoDB connection failed...')
  })
