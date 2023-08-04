import { Router } from 'express'
import { catchError } from 'extrass'
const router = Router()

import * as _authController from '../controller/account/authController'
const authController = catchError(_authController)
import * as _tokenController from '../controller/account/tokenController'
const tokenController = catchError(_tokenController)

router.post('/signup', authController.signup, tokenController.sendUserAndToken)
router.post('/login', authController.login, tokenController.sendUserAndToken)

router.post(
  '/verify',
  tokenController.checkAuthTokenNotVerifiedUser,
  authController.verifyUser,
  tokenController.sendUserAndToken
)
router.post(
  '/resend-verification-code',
  tokenController.checkAuthToken,
  authController.resendVerificationCode
)

router.all(
  '/token',
  tokenController.getAuthTokenByCookie,
  tokenController.sendUserAndToken
)

router.post('/clear', tokenController.clearCookieToken)

export default router
