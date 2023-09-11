import Transaction from '../../model/Transaction'
import { UserHandler } from '../types'
import create from './createTransaction'

export const getTransactions: UserHandler = async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.user._id })
  res.success({ transactions })
}

export const createTransaction: UserHandler = async (req, res, next) => {
  const body = {
    ...req.body,
    user: req.user._id,
    type: req.params.type,
  }

  const transaction = await create(body)
  res.success({ transaction })
}

export const updateTransaction: UserHandler = async (req, res, next) => {
  res.success({ message: 'update transaction' })
}

export const deleteTransaction: UserHandler = async (req, res, next) => {
  res.success({ message: 'delete transaction' })
}
