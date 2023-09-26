import { UserHandler } from '../types'
import Category from '../../model/Category'
import { runMultipleOperation } from '../../utils/controller'

export const getCategories: UserHandler = async (req, res, next) => {
  const categories = await Category.find({ user: req.user.id })
  res.success({ categories })
}

export const createCategory: UserHandler = async (req, res, next) => {
  const promises = req.body.map((body) => {
    return runMultipleOperation(() =>
      Category.create({
        user: req.user._id,
        type: body.type,
        name: body.name,
      })
    )
  })

  const categories = await Promise.all(promises)
  res.success({ categories })
}

export const updateCategory: UserHandler = async (req, res, next) => {
  const promises = Object.entries(req.body).map(([_id, body]: any) => {
    return runMultipleOperation(async () => {
      const category = await Category.findById(_id)
      if (!category) throw new ReqError('Category not found', 404)

      category.set({ name: body.name })
      return category.save()
    })
  })

  const categories = await Promise.all(promises)
  res.success({ categories })
}

export const deleteCategory: UserHandler = async (req, res, next) => {
  const uniqueIds = [...new Set((req.params.id || '').split(','))]

  const promises = uniqueIds.map((id) => {
    return runMultipleOperation(async () => {
      const category = await Category.findById(id)
      if (!category) throw new ReqError('Category not found', 404)
      return category.delete()
    }, null)
  })

  const categories = await Promise.all(promises)
  res.success({ categories })
}
