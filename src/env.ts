import { env } from 'extrass'

const result = env({
  DB_URL: r.string(),
  DB_PASS: r.string(),
  BCRYPT_SALT_ROUND: r.number(),
  BCRYPT_SALT_ROUND_2: r.number(),
})

export default { ...result }
