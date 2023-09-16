import { UserHandler } from '../types'
import Category from '../../model/Category'

export const getCategories: UserHandler = async (req, res, next) => {
  const categories = await Category.find({ user: req.user.id })
  res.success({ categories })
}

export const createCategory: UserHandler = async (req, res, next) => {
  const category = await Category.create({
    ...req.getBody('name', 'type'),
    user: req.user.id,
  })

  res.success({ category })
}

export const updateCategory: UserHandler = async (req, res, next) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user.id,
  })

  if (!category) throw new ReqError('Category not found', 404)

  category.set(req.getBody('name'))
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
