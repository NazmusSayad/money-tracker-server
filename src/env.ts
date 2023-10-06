import { env } from 'rype'
import nodeEnv from 'cli-node-env'

const prodEnv = {
  DB_URL: r.string(),
  DB_PASS: r.string(),
  BCRYPT_SALT_ROUND: r.number(),
  BCRYPT_SALT_ROUND_2: r.number(),
  JWT_SECRET: r.string(),
  SMTP_SECRET: r.string(),
}

const devEnv = {
  DB_URL: 'mongodb://127.0.0.1:27017/money-tracker?retryWrites=true&w=majority',
  DB_PASS: '',
  BCRYPT_SALT_ROUND: 2,
  BCRYPT_SALT_ROUND_2: 2,
  JWT_SECRET: 'Boom',
  SMTP_SECRET: 'Boom',
}

export default nodeEnv.isDev ? devEnv : env(prodEnv)
