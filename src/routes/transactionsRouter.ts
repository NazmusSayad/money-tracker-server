import { Router } from 'express'
import { transactionController, tokenController } from '../controller'
const router = Router()

router.use(tokenController.checkAuthTokenVerifiedUser)

router.get('/', transactionController.getTransactions)
router.post('/:type', transactionController.createTransaction)
router.patch('/:id', transactionController.updateTransaction)
router.delete('/:id', transactionController.deleteTransaction)

export default router
