import { Router } from 'express'
import authRouter from './routes/authRouter'
import userRouter from './routes/userRouter'
const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)

export default router
