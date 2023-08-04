import {
  generateAuthToken,
  parseUserFromToken,
  generateCookieToken,
  parseUserFromCookie,
} from '../../utils/jwt'
import io from '../../socket'
import { UserReq } from '../types'

function checkAuthFactory(isVerified?: boolean): UserReq {
  return async (req, res, next) => {
    const { authorization, socketid = '' } = r.noType({
      authorization: r.string(),
      socketid: r.o.string(),
    })({
      authorization: req.headers.authorization,
      socketid: req.headers.socketid,
    })

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

export const getAuthTokenByCookie: UserReq = async (req, res, next) => {
  const { cookieToken } = r({ cookieToken: r.string() })({
    cookieToken: req.cookies.cookieToken!,
  })
  req.user = await parseUserFromCookie(cookieToken)
  next()
}

export const clearCookieToken: UserReq = (req, res) => {
  res.clearCookie('cookieToken')
  res.status(204).end()
}

export const sendUserAndToken: UserReq = (req, res) => {
  const cookieToken = generateCookieToken(req.user)
  const authToken = generateAuthToken(req.user)

  res.cookie('hasToken', 'true', {
    secure: true,
    httpOnly: false,
    sameSite: 'none',
    maxAge: 86400000 /* 1 day in miliseconds * 30 = 30 days */ * 30,
  })
  res.cookie('cookieToken', cookieToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 86400000 /* 1 day in miliseconds * 30 = 30 days */ * 30,
  })

  res.success({ user: req.user.getSafeInfo(), token: authToken })
}
