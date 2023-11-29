import dotenv from 'dotenv'
dotenv.config()
import sequelize from './settings/db.js'
import http from 'http'
import express from 'express'
import cors from 'cors'
import errorHandler from './middleware/errorHandlingMiddleware.js'
import router from './routes/index.js'

const app = express()
const PORT = process.env.PORT || 5000
const server = http.createServer(app)

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use(express.static(new URL('static', import.meta.url).pathname))
app.use('/api', router)
app.use(errorHandler)

server.listen(PORT, async (err) => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log(e)
    }
})
