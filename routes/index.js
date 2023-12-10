import { Router } from 'express'
import userRouter from './userRouter.js'
import chatGPTRouter from './chatGPTRouter.js'

const router = new Router()

router.use('/auth', userRouter)
router.use('/chat-gpt', chatGPTRouter)

export default router
