import { catchError } from 'extrass'

import * as auth from './auth/authController'
import * as token from './auth/tokenController'
import * as user from './auth/userController'

import * as accounts from './accounts/accountsController'
import * as category from './categories/categoriesController'
import * as transaction from './transactions/transactionsController'

export const authController = catchError(auth)
export const tokenController = catchError(token)
export const userController = catchError(user)

export const accountsController = catchError(accounts)
export const categoryController = catchError(category)
export const transactionController = catchError(transaction)
