const ApiError = require('../exceptions/apiError')

module.exports = function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        return ApiError.UnauthorizedError()
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) {
            return ApiError.ForbiddenError()
        }

        req.user = user
        next()
    })
}
