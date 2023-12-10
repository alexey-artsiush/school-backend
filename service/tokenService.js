import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
        let tokenData = await prisma.token.findFirst({ where: { userId } })

        if (tokenData) {
            tokenData = await prisma.token.update({
                where: { id: tokenData.id },
                data: { refreshToken },
            })
        } else {
            tokenData = await prisma.token.create({
                data: {
                    userId,
                    refreshToken,
                },
            })
        }

        return tokenData
    }

    async removeToken(refreshToken) {
        const deletedToken = await prisma.token.delete({
            where: { refreshToken },
        })
        return deletedToken
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
        const tokenData = await prisma.token.findFirst({
            where: { refreshToken },
        })
        return tokenData
    }
}

export default new TokenService()
