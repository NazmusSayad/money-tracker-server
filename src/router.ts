import { Router } from 'express'
import auth from './routes/authRouter'
const router = Router()

router.use('/auth', auth)

export default router
