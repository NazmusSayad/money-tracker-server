import {
  generateAuthToken,
  parseUserFromToken,
  generateCookieToken,
  parseUserFromCookie,
} from '../../utils/jwt'
import io from '../../socket'
import { UserHandler } from '../types'
import { originToDomain } from '../../utils'

function checkAuthFactory(isVerified?: boolean): UserHandler {
  return async (req, res, next) => {
    const { authorization, socketid } = r
      .object({ authorization: r.string(), socketid: r.string().default('') })
      .parse(req.headers)

    const user = await parseUserFromToken(authorization, isVerified)
    const sockets = io.to(user._id.toString()).except(socketid)

    req.user = user
    req.io = { emit: sockets.emit, disconnect: sockets.disconnectSockets }

    next()
  }
}
export const checkAuthToken = checkAuthFactory()
export const checkAuthTokenVerifiedUser = checkAuthFactory(true)
export const checkAuthTokenNotVerifiedUser = checkAuthFactory(false)

export const getAuthTokenByCookie: UserHandler = async (req, res, next) => {
  const { cookieToken } = r
    .object({ cookieToken: r.string() })
    .parse(req.cookies)

  req.user = await parseUserFromCookie(cookieToken)
  next()
}

export const clearCookieToken: UserHandler = (req, res) => {
  res.clearCookie('cookieToken')
  res.status(204).end()
}

export const sendUserAndToken: UserHandler = (req, res) => {
  const cookieToken = generateCookieToken(req.user)
  const authToken = generateAuthToken(req.user)

  res.cookie('cookieToken', cookieToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 86400000 * 30, // 1 day in milliseconds * 30 = 30 days
  })

  res.success({ user: req.user.getSafeInfo(), jwt_token: authToken })
}
