import { UserHandler } from '../types'

export const getUser: UserHandler = (req, res, next) => {
  res.success({ user: req.user.getSafeInfo() })
}

export const updateUser: UserHandler = async (req, res, next) => {
  const body = req.getBody('name', 'avatar')
  req.user.set(body)
  await req.user.save()
  res.success({ user: req.user.getSafeInfo() })
}
