import { Router } from 'express'
import userRouter from './userRouter.js'
import chatGPTRouter from './chatGPTRouter.js'
import courseRouter from './courseRouter.js'

const router = new Router()

router.use('/auth', userRouter)
router.use('/chat-gpt', chatGPTRouter)
router.use('/course', courseRouter)

export default router
