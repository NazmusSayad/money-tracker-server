import { Router } from 'express'
import { catchError } from 'extrass'
const userRouter = Router()

import * as _userController from '../controller/userController'
const userController = catchError(_userController)

userRouter.post('/signup', userController.signup)

export default userRouter
