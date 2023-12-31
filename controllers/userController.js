import UserService from '../service/userService.js'
import userService from '../service/userService.js'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/apiError.js'

export class UserController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 60 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            return res.json({
                success: true,
                data: userData,
            })
        } catch (e) {
            next(e)
        }
    }

    async register(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Validation error', errors.array())
                )
            }
            const { email, password, role } = req.body
            const userData = await UserService.register(email, password, role)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 60 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.json({
                success: true,
                data: {
                    userData,
                },
            })
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        const { refreshToken } = req.cookies
        await userService.logout(refreshToken)
        res.clearCookie('refreshToken')
        return res.json({
            success: true,
            data: {
                message: 'logout success',
            },
        })
        try {
            return res.json({})
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 60 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })

            return res.json({
                success: true,
                data: userData,
            })
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json({
                success: true,
                data: users,
            })
        } catch (e) {
            next(e)
        }
    }
}
