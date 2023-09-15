import { Router } from 'express'
import authRouter from './routes/authRouter'
import userRouter from './routes/userRouter'
import categoryRouter from './routes/categoryRouter'
import accountsRouter from './routes/accountsRouter'
import transactionsRouter from './routes/transactionsRouter'
const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/category', categoryRouter)
router.use('/accounts', accountsRouter)
router.use('/transaction', transactionsRouter)

export default router
