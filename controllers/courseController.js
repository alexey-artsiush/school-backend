import courseService from '../service/courseService.js'

export class CourseController {
    async getCourses(req, res, next) {
        const { id } = req.query
        try {
            const courses = await courseService.getAllCourses(id)
            return res.json({
                success: true,
                data: courses,
            })
        } catch (e) {
            next(e)
        }
    }
}
