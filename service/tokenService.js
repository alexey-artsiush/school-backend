import { Token } from '../models/index.js'
import jwt from 'jsonwebtoken'

class TokenService {
    generateTokens(payload) {
        const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '24h',
        })
        return {
            token,
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, token) {
        const tokenData = await Token.findOne({ userId })
        if (tokenData) {
            tokenData.token = token
            return tokenData.save()
        }
        const newToken = await Token.create({ userId, refreshToken: token })
        return newToken
    }
}

export default new TokenService()
