import { Router } from 'express'
import controller from '../controller'
const router = Router()

router.post(
  '/signup',
  controller.auth.signup,
  controller.token.sendUserAndToken
)
router.post('/login', controller.auth.login, controller.token.sendUserAndToken)

router.post(
  '/send-verification-code',
  controller.token.checkAuthToken,
  controller.auth.sendVerificationCode
)
router.post(
  '/verify-user',
  controller.token.checkAuthTokenNotVerifiedUser,
  controller.auth.matchVerifyCode,
  controller.auth.verifyUser,
  controller.token.sendUserAndToken
)

router.post('/send-recover-code', controller.auth.sendRecoverCode)
router.post(
  '/reset-password',
  controller.auth.resetPassword,
  controller.token.sendUserAndToken
)

router.all(
  '/token',
  controller.token.getAuthTokenByCookie,
  controller.token.sendUserAndToken
)

router.post('/clear', controller.token.clearCookieToken)

export default router
