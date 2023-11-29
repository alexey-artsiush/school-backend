import ApiError from '../exceptions/apiError.js'

export default function errorHandler(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message })
    }
    return res.status(500).json({ message: 'Unexpected error', err })
}
