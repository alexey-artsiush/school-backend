import dotenv from 'dotenv'
import http from 'http'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import errorMiddleware from './middleware/errorHandlingMiddleware.js'
import router from './routes/index.js'
import { PrismaClient } from '@prisma/client'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

dotenv.config()
const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 5000
const server = http.createServer(app)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(join(__dirname, 'static')))
app.use('/api', router)
app.use(errorMiddleware)

server.listen(PORT, async (err) => {
    try {
        await prisma.$connect()
        console.log('Connected to database')
    } catch (e) {
        console.log(e)
    }
})

process.on('SIGINT', async () => {
    console.log('Disconnecting from the database')
    await prisma.$disconnect()
    process.exit()
})
