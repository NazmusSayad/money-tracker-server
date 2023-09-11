import { Router } from 'express'
import authRouter from './routes/authRouter'
import userRouter from './routes/userRouter'
import accountsRouter from './routes/accountsRouter'
import transactionsRoute from './routes/transactionsRoute'
const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/accounts', accountsRouter)
router.use('/transaction', transactionsRoute)



export default router
