import { Router } from 'express'
import { tokenController, userController } from '../controller'
const router = Router()

router.use(tokenController.checkAuthToken)

router.get('/', userController.getUser)
router.patch('/', userController.updateUser)

export default router
