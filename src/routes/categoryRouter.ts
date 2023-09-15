import { Router } from 'express'
import { categoryController } from '../controller'

const router = Router()

router.get('/', categoryController.getCategories)
router.post('/', categoryController.createCategory)
router.put('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

export default router
