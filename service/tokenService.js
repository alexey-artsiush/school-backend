import { Token } from '../models/index.js'
import jwt from 'jsonwebtoken'

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '2h',
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '60d',
        })
        return {
            accessToken,
            refreshToken,
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ userId })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const newToken = await Token.create({
            userId,
            refreshToken: refreshToken,
        })
        return newToken
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({ where: { refreshToken } })
        return tokenData
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }
    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ where: { refreshToken } })
        return tokenData
    }
}

export default new TokenService()
