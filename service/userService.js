import ApiError from '../exceptions/apiError.js'
import UserDto from '../dtos/userDto.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import tokenService from './tokenService.js'
import mailService from './mailService.js'
import { PrismaClient } from '@prisma/client'
import { ROLES } from '../constants/roles.js'

const prisma = new PrismaClient()
class UserService {
    async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            throw ApiError.BadRequest('User not found')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)

        if (!isPassEquals) {
            throw ApiError.BadRequest('Incorrect password')
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async register(email, password, role) {
        const candidate = await prisma.user.findUnique({ where: { email } })

        if (candidate) {
            throw ApiError.BadRequest('User with this email already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 5)
        const activationLink = uuidv4()

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                activationLink,
                role: ROLES.STUDENT,
            },
        })

        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/auth/activate/${activationLink}`
        )

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto,
        }
    }
    async activate(activationLink) {
        const user = await prisma.user.findUnique({ where: { activationLink } })

        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { isActivated: true },
        })
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }

        const user = await prisma.user.findUnique({
            where: { id: userData.id },
        })
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        const users = await prisma.user.findMany()
        return users
    }
}

export default new UserService()
