import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { ChatGPTController } from '../controllers/chatGPTController.js'

const router = new Router()
const chaGPTController = new ChatGPTController()

router.post('/send-message', chaGPTController.sendMessage)

export default router
