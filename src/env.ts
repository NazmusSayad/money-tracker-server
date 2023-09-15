import { env } from 'rype'
import nodeEnv from 'cli-node-env'

const devEnv = {
  DB_URL: r
    .string()
    .default(
      'mongodb://127.0.0.1:27017/money-tracker?retryWrites=true&w=majority'
    ),
  DB_PASS: r.string().default(''),
  JWT_SECRET: r.string().default('Boom'),
  BCRYPT_SALT_ROUND: r.number().default(2),
  BCRYPT_SALT_ROUND_2: r.number().default(2),
}

const prodEnv = {
  DB_URL: r.string(),
  DB_PASS: r.string(),
  JWT_SECRET: r.string(),
  BCRYPT_SALT_ROUND: r.number(),
  BCRYPT_SALT_ROUND_2: r.number(),
}

export default env(nodeEnv.isDev ? devEnv : prodEnv)
