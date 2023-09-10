import { catchError } from 'extrass'

import * as authController from './auth/authController'
import * as tokenController from './auth/tokenController'
import * as userController from './auth/userController'

const controller = {
  auth: authController,
  token: tokenController,
  user: userController,
}

export default Object.fromEntries(
  Object.entries(controller).map(([key, controller]) => [
    key,
    catchError(controller),
  ])
) as typeof controller
