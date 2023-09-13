import { NormalHandler, UserHandler } from '../types'
import User from '../../model/User'

export const signup: UserHandler = async (req, res, next) => {
  const body = req.getBody('name', 'avatar', 'email', 'password')
  await User.checkEmailAvailability(body.email)
  const user = await User.create(body)
  await user.createOTP('email-verification')

  req.user = user
  next()
}

export const sendVerificationCode: UserHandler = async (req, res) => {
  const user = req.user

  if (user.isVerified && !user.pendingEmail) {
    throw new ReqError('There is no running verification process')
  }

  await user.createOTP('email-verification')
  res.success({ message: 'An email sent to your email' })
}

export const verifyUser: UserHandler = async (req, res, next) => {
  await req.user.checkVerifyCode(req.body.code)
  req.user.isVerified = true
  await req.user.save()
  next()
}

const loginBodySchema = r.object({ email: r.string(), password: r.string() })
export const login: UserHandler = async (req, res, next) => {
  const body = loginBodySchema.parse(req.body, 'User')
  const user = await User.findOne({ email: body.email })
  if (!(user && (await user.isPassMatched(body.password)))) {
    throw new ReqError('Login credentials are invalid!', 401)
  }

  req.user = user
  next()
}

export const sendRecoverCode: NormalHandler = async (req, res) => {
  const body = r.object({ email: r.string() }).parse(req.body)
  const user = await User.findOne({ email: body.email })

  res.success({ message: 'An email sent to your email if any user exists' })
  user && (await user.createOTP('account-recover'))
}

const resetBodySchema = r.object({
  email: r.string(),
  code: r.string(),
  password: r.string(),
})
export const resetPassword: UserHandler = async (req, res, next) => {
  const body = resetBodySchema.parse(req.body, 'Reset')
  const user = await User.findOne({ email: body.email })

  if (user && (await user.checkRecoverCode(req.body.code))) {
    user.password = body.password
    await user.save()
    req.user = user
    return next()
  }

  throw new ReqError('Invalid otp or email provided', 401)
}
