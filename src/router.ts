import { Router } from 'express'
import authRouter from './routes/authRouter'
import userRouter from './routes/userRouter'
import accountsRouter from './routes/accountsRouter'
import categoryRouter from './routes/categoryRouter'
import transactionsRouter from './routes/transactionsRouter'
const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)

router.use('/accounts', accountsRouter)
router.use('/categories', categoryRouter)
router.use('/transactions', transactionsRouter)

export default router
