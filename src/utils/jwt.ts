import jsonwebtoken from 'jsonwebtoken'
import User, { UserDoc } from '../model/User'
import env from '../env'
const jwtTokenPrefix = 'Bearer '
const error = new ReqError('Invalid token')

const generateJwt = (key: string, value, expiresIn = '90d'): string => {
  const data = { [key]: value }
  return jsonwebtoken.sign(data, env.JWT_SECRET, {
    expiresIn,
  })
}

const parseJwt = (token: string) => {
  if (!token || typeof token !== 'string') throw error
  if (token.startsWith(jwtTokenPrefix)) {
    token = token.slice(jwtTokenPrefix.length)
  }

  const tokenInfo = jsonwebtoken.verify(token, env.JWT_SECRET)
  const currentTime = Math.floor(Date.now() / 1000)
  if (tokenInfo.exp <= currentTime) {
    throw new ReqError('errorMessages.auth.jwtExpire')
  }

  return tokenInfo
}

const createUserParserFactory = (key: string) => {
  return async (token: string, isVerified?: boolean): Promise<UserDoc> => {
    const { [key]: userId, iat } = parseJwt(token)

    const query: any = { _id: userId }
    if (isVerified != null) query.isVerified = isVerified
    const user = await User.findOne(query)

    if (!user) throw new ReqError('No user found', 401)
    if (
      user.passwordModifiedAt &&
      iat < Math.ceil(new Date(user.passwordModifiedAt).valueOf() / 1000)
    ) {
      throw new ReqError('Auth token expired', 401)
    }

    return user
  }
}

const createUserTokenFactory = (key: string) => (user: UserDoc) => {
  return generateJwt(key, user._id.toString())
}

export const generateCookieToken = createUserTokenFactory('cookie')
export const generateAuthToken = createUserTokenFactory('token')

export const parseUserFromCookie = createUserParserFactory('cookie')
export const parseUserFromToken = createUserParserFactory('token')