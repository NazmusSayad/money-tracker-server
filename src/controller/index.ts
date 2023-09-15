import { catchError } from 'extrass'

import * as auth from './auth/authController'
import * as token from './auth/tokenController'
import * as user from './auth/userController'

import * as accounts from './accounts/accountsController'
import * as transaction from './transaction/transactionController'
import * as category from './category/categoryController'

export const authController = catchError(auth)
export const tokenController = catchError(token)
export const userController = catchError(user)
export const accountsController = catchError(accounts)
export const transactionController = catchError(transaction)
export const categoryController = catchError(category)
