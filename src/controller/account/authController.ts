import { NormalHandler, UserHandler } from '../types'
import User from '../../model/User'
import { generateOTP } from '../../utils/otp'

export const signup: UserHandler = async (req, res, next) => {
  const body = req.getBody('name', 'avatar', 'email', 'password')
  await User.checkEmailAvailability(body.email)
  const user = await User.create({
    ...body,
    verificationCode: generateOTP(6),
  })

  req.user = user
  next()
}

export const sendVerificationCode: UserHandler = async (req, res, next) => {
  if (req.user.isVerified && !req.user.pendingEmail) {
    throw new ReqError('There is no running verification process')
  }

  req.user.verificationCode = generateOTP(6)
  await req.user.save()
  res.success({ message: 'An email sent to your email' })
}

export const matchVerifyCode: UserHandler = async (req, res, next) => {
  if (!(await req.user.isVerifyCodeMatched(req.body.code))) {
    throw new ReqError('Invalid otp provided', 401)
  }

  next()
}

export const verifyUser: UserHandler = async (req, res, next) => {
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

export const sendRecoverCode: NormalHandler = async (req, res, next) => {
  const body = r.object({ email: r.string() }).parse(req.body)
  const user = await User.findOne({ email: body.email })

  res.success({ message: 'An email sent to your email if any user exists' })

  if (user) {
    user.recoverCode = generateOTP(6)
    await user.save()
  }
}

const resetBodySchema = r.object({
  email: r.string(),
  code: r.string(),
  password: r.string(),
})
export const resetPassword: UserHandler = async (req, res, next) => {
  const body = resetBodySchema.parse(req.body, 'Reset')
  const user = await User.findOne({ email: body.email })

  if (
    user &&
    user.recoverCode &&
    (await user.isRecoverCodeMatched(req.body.code))
  ) {
    user.password = body.password
    user.recoverCode = undefined
    await user.save()
    req.user = user

    return next()
  }

  throw new ReqError('Invalid otp or email provided', 401)
}
