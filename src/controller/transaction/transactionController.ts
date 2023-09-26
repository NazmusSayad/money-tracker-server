import Transaction from '../../model/Transaction'
import { runMultipleOperation } from '../../utils/controller'
import { UserHandler } from '../types'
import { create, update } from './createTransaction'

export const getTransactions: UserHandler = async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.user._id })
  res.success({ transactions })
}

export const createTransaction: UserHandler = async (req, res, next) => {
  const promises = req.body.map((body) => {
    return runMultipleOperation(() =>
      create({
        ...body,
        user: req.user._id,
      })
    )
  })

  const transactions = await Promise.all(promises)
  res.success({ transactions })
}

export const updateTransaction: UserHandler = async (req, res, next) => {
  const promises = Object.entries(req.body).map(([_id, body]: any) => {
    return runMultipleOperation(() =>
      update(_id, req.user._id, {
        ...body,
        user: req.user._id,
      })
    )
  })

  const transactions = await Promise.all(promises)
  res.success({ transactions })
}

export const deleteTransaction: UserHandler = async (req, res, next) => {
  const uniqueIds = [...new Set((req.params.id || '').split(','))]

  const promises = uniqueIds.map((id) => {
    return runMultipleOperation(async () => {
      const transaction = await Transaction.findOne({
        _id: id,
        user: req.user._id,
      })

      if (!transaction) throw new ReqError('Transaction not found', 404)
      return transaction.delete()
    }, null)
  })

  const transactions = await Promise.all(promises)
  res.success({ transactions })
}
