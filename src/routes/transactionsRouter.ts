import { Router } from 'express'
import { transactionController, tokenController } from '../controller'
const router = Router()

router.use(tokenController.checkAuthTokenVerifiedUser)

router.get('/', transactionController.getTransactions)
router.post('/', transactionController.createTransaction)
router.patch('/', transactionController.updateTransaction)
router.delete('/:id', transactionController.deleteTransaction)

export default router
