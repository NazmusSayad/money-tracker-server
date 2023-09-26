import { Router } from 'express'
import { categoryController, tokenController } from '../controller'

const router = Router()
router.use(tokenController.checkAuthTokenVerifiedUser)

router.get('/', categoryController.getCategories)
router.post('/', categoryController.createCategory)
router.patch('/', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

export default router
