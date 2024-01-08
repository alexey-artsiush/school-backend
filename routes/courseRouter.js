import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { CourseController } from '../controllers/courseController.js'

const router = new Router()
const courseController = new CourseController()

router.get('/get-courses', courseController.getCourses)

export default router
