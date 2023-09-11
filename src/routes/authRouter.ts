import { Router } from 'express'
import { authController, tokenController } from '../controller'
const router = Router()

router.post('/signup', authController.signup, tokenController.sendUserAndToken)
router.post('/login', authController.login, tokenController.sendUserAndToken)

router.post(
  '/send-verification-code',
  tokenController.checkAuthToken,
  authController.sendVerificationCode
)
router.post(
  '/verify-user',
  tokenController.checkAuthTokenNotVerifiedUser,
  authController.matchVerifyCode,
  authController.verifyUser,
  tokenController.sendUserAndToken
)

router.post('/send-recover-code', authController.sendRecoverCode)
router.post(
  '/reset-password',
  authController.resetPassword,
  tokenController.sendUserAndToken
)

router.all(
  '/token',
  tokenController.getAuthTokenByCookie,
  tokenController.sendUserAndToken
)

router.post('/clear', tokenController.clearCookieToken)

export default router
