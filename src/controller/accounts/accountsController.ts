import { UserHandler } from '../types'
import Accounts from '../../model/Accounts'

export const getAccounts: UserHandler = async (req, res, next) => {
  const accounts = await Accounts.find({ user: req.user })
  res.success({ accounts })
}

export const createAccount: UserHandler = async (req, res, next) => {
  const account = await Accounts.create({
    user: req.user,
    name: req.body.name,
  })

  res.success({ account })
}

export const updateAccount: UserHandler = async (req, res, next) => {
  const account = await Accounts.findById(req.params.id)
  if (!account) throw new ReqError('Account not found', 404)

  account.set({ name: req.body.name })
  await account.save()
  res.success({ account })
}

export const deleteAccount: UserHandler = async (req, res, next) => {
  const account = await Accounts.findById(req.params.id)
  if (!account) throw new ReqError('Account not found', 404)
  await account.delete()

  res.status(204).end()
}
