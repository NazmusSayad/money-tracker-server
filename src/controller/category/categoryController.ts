import { UserHandler } from '../types'
import Category, { categoryRypeSchema } from '../../model/Category'

export const getCategories: UserHandler = async (req, res, next) => {
  const categories = await Category.find({ user: req.user.id })
  res.success({ categories })
}

export const createCategory: UserHandler = async (req, res, next) => {
  const body = categoryRypeSchema.omit('user').parse(req.body)
  const category = await Category.create(body)
  res.success({ category })
}

export const updateCategory: UserHandler = async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user.id,
  })

  if (!category) throw new ReqError('Category not found', 404)

  const body = categoryRypeSchema.omit('user').partial().parse(req.body)
  category.set(body)

  await category.save()
  res.success({ category })
}

export const deleteCategory: UserHandler = async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user.id,
  })

  if (!category) throw new ReqError('Category not found', 404)

  await category.remove()
  res.status(204).end()
}
