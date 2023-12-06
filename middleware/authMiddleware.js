import tokenService from '../service/tokenService.js'
import ApiError from '../exceptions/apiError.js'

export default function authMiddleware(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = req.headers['authorization']?.split(' ')[1]
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }
        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}
