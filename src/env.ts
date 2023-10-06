import { env } from 'rype'
import nodeEnv from 'cli-node-env'

const prodEnv = {
  DB_URL: r.string(),
  DB_PASS: r.string(),
  JWT_SECRET: r.string(),
  BCRYPT_SALT_ROUND: r.number(),
  BCRYPT_SALT_ROUND_2: r.number(),
}

const devEnv = {
  DB_URL: 'mongodb://127.0.0.1:27017/money-tracker?retryWrites=true&w=majority',
  DB_PASS: '',
  JWT_SECRET: 'Boom',
  BCRYPT_SALT_ROUND: 2,
  BCRYPT_SALT_ROUND_2: 2,
}

export default nodeEnv.isDev ? devEnv : env(prodEnv)
