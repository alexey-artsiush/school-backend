import ApiError from '../exceptions/apiError.js'
import UserDto from '../dtos/userDto.js'
import { User } from '../models/index.js'
import bcrypt from 'bcrypt'
import tokenService from './tokenService.js'
class UserService {
    async login(email, password) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw ApiError.BadRequest('Invalid email or password')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)

        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid email or password')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.token)
        return { tokens, userDto }
    }

    async register(email, password) {
        const candidate = await User.findOne({ where: { email } })

        if (candidate) {
            throw ApiError.BadRequest('User with this email already exists')
        }

        const hashedPassword = await bcrypt.hash(password, 5)

        const user = await User.create({
            email,
            password: hashedPassword,
        })

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.token)

        return { tokens, userDto }
    }
}

export default new UserService()
