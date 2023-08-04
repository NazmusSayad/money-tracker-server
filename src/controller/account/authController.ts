import { UserReq } from '../types'
import User from '../../model/User'
import { generateOTP } from '../../utils/otp'

export const signup: UserReq = async (req, res, next) => {
  const body = req.getBody('name', 'avatar', 'email', 'password')
  await User.checkEmailAvailability(body.email)
  const user = await User.create({
    ...body,
    verificationCode: generateOTP(6),
  })

  req.user = user
  next()
}

export const resendVerificationCode: UserReq = async (req, res, next) => {
  if (req.user.isVerified && !req.user.pendingEmail) {
    throw new ReqError('There is no running verification process')
  }

  req.user.verificationCode = generateOTP(6)
  await req.user.save()
  res.success({ message: 'An email sent to your email' })
}

export const verifyUser: UserReq = async (req, res, next) => {
  if (!(req.body.code && (await req.user.isVerifyCodeMatched(req.body.code)))) {
    throw new ReqError('Invalid otp provided', 401)
  }

  req.user.isVerified = true
  await req.user.save()

  next()
}

export const login: UserReq = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!(user && (await user.isPassMatched(req.body.password)))) {
    throw new ReqError('Login credintials are invalid!', 401)
  }

  req.user = user
  next()
}
