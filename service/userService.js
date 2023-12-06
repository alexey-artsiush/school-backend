import ApiError from '../exceptions/apiError.js'
import UserDto from '../dtos/userDto.js'
import { User } from '../models/index.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import tokenService from './tokenService.js'
import mailService from './mailService.js'
class UserService {
    async login(email, password) {
        const user = await User.findOne({ where: { email: email } })
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
        const candidate = await User.findOne({ where: { email } })

        if (candidate) {
            throw ApiError.BadRequest('User with this email already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 5)
        const activationLink = uuidv4()

        const user = await User.create({
            email,
            password: hashedPassword,
            activationLink,
            role,
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
        const user = await User.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Incorrect activation link')
        }
        user.isActivated = true
        await user.save()
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
        console.log(userData, 'userDatauserDatauserData')
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findOne({ where: { id: userData.id } })
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async getAllUsers() {
        const users = await User.findAll()
        return users
    }
}

export default new UserService()
