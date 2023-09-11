import { Router } from 'express'
import controller from '../controller'
const router = Router()

router.use(controller.token.checkAuthToken)

router.get('/', controller.user.getUser)
router.patch('/', controller.user.updateUser)

export default router
