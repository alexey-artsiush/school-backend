import { Router } from 'express'
import { UserController } from '../controllers/userController.js'

const router = new Router()
const userController = new UserController()

router.post('/login', userController.login)

export default router
