import UserService from '../service/userService.js'

export class UserController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await UserService.login(email, password)

            return res.json({
                success: true,
                data: {
                    token: userData.tokens.token,
                    email: userData.userDto.email,
                    id: userData.userDto.id,
                },
            })
        } catch (e) {
            next(e)
        }
    }

    async register(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await UserService.register(email, password)

            return res.json({
                success: true,
                data: {
                    token: userData.tokens.token,
                    email: userData.userDto.email,
                    id: userData.userDto.id,
                },
            })
        } catch (e) {
            next(e)
        }
    }
}
