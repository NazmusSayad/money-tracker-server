import { Router } from 'express'
import { tokenController, accountsController } from '../controller'
const router = Router()

router.use(tokenController.checkAuthToken)

router.get('/', accountsController.getAccounts)
router.post('/', accountsController.createAccount)
router.patch('/:id', accountsController.updateAccount)
router.delete('/:id', accountsController.deleteAccount)

export default router
