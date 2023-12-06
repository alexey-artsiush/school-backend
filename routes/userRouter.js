import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { body } from 'express-validator'
import authMiddleware from '../middleware/authMiddleware.js'

const router = new Router()
const userController = new UserController()

router.post('/login', userController.login)
router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 32 }),
    userController.register
)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

export default router
