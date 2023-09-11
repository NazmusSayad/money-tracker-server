import { deepCatchError } from '../utils'

import * as authController from './auth/authController'
import * as tokenController from './auth/tokenController'
import * as userController from './auth/userController'
export default deepCatchError({
  auth: authController,
  token: tokenController,
  user: userController,
})
