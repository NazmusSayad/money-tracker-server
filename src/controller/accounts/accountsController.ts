import { UserHandler } from '../types'
import Accounts from '../../model/Accounts'
import { runMultipleOperation } from '../../utils/controller'

export const getAccounts: UserHandler = async (req, res, next) => {
  const accounts = await Accounts.find({ user: req.user })
  res.success({ accounts })
}

export const createAccount: UserHandler = async (req, res, next) => {
  const promises = req.body.map((account: any) => {
    return runMultipleOperation(() =>
      Accounts.create({
        user: req.user,
        name: account.name,
      })
    )
  })

  const accounts = await Promise.all(promises)
  res.success({ accounts })
}

export const updateAccount: UserHandler = async (req, res, next) => {
  const promises = Object.entries(req.body).map(([_id, body]: any) => {
    return runMultipleOperation(async () => {
      const account = await Accounts.findById(_id)
      if (!account) throw new ReqError('Account not found', 404)

      account.set({ name: body.name })
      return account.save()
    })
  })

  const accounts = await Promise.all(promises)
  res.success({ accounts })
}

export const deleteAccount: UserHandler = async (req, res, next) => {
  const uniqueIds = [...new Set((req.params.id || '').split(','))]

  const promises = uniqueIds.map((id) => {
    return runMultipleOperation(async () => {
      const account = await Accounts.findById(id)
      if (!account) throw new ReqError('Account not found', 404)
      return account.delete()
    }, null)
  })

  const accounts = await Promise.all(promises)
  res.success({ accounts })
}
