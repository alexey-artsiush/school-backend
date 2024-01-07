import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class CourseService {
    async getAllCourses(id) {
        // const courses = await prisma.course.findMany()
        const courses = [
            {
                id: 1,
                image: 'https://fondy.ua/uploads/2023/02/education_main.jpg',
                title: 'Название курса 1',
                progress: 70,
                completed: false,
                text: {
                    intro:
                        'Welcome!\n' +
                        '\n' +
                        "Are you ready to embark on a journey of discovery and growth? This course is designed to empower you with the knowledge and skills necessary to navigate the complexities of [Course Subject]. Whether you're a beginner or looking to deepen your expertise, this course is tailored to meet your needs.",
                    end: 'Thank you for choosing. We wish you continued success in your learning endeavors. Keep exploring, keep growing, and never stop learning!',
                },
                video: `${process.env.API_URL}/video/1.mp4`,
            },
            {
                id: 2,
                image: 'https://pm-production-bucket.s3.eu-central-1.amazonaws.com/attachments/course_prefix/46/card_image/default-35791f8b5c811c74161f0fb97c914ae1.jpg',
                title: 'Название курса 2',
                progress: 100,
                completed: true,
                text: {
                    intro:
                        'Welcome!\n' +
                        '\n' +
                        "Are you ready to embark on a journey of discovery and growth? This course is designed to empower you with the knowledge and skills necessary to navigate the complexities of [Course Subject]. Whether you're a beginner or looking to deepen your expertise, this course is tailored to meet your needs.",
                    end: 'Thank you for choosing. We wish you continued success in your learning endeavors. Keep exploring, keep growing, and never stop learning!',
                },
                video: `${process.env.API_URL}/video/1.mp4`,
            },
        ]
        if (!id) return courses
        const result = courses.find((item) => item.id == id)
        return result
    }
}

export default new CourseService()
