import express from 'express'
import { config } from 'dotenv'

import user from './routes/user.js'
import product from './routes/products.js'
import order from './routes/order.js'
import { errorMiddleware } from './middlewares/error.js'
import cookieParser from 'cookie-parser'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import cors from "cors"

config({
    path: "./data/config.env"
})





export const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: [process.env.FRONTEND_URI_1, process.env.FRONTEND_URI_2]
}))


app.use("/api/v1/user", user)
app.use("/api/v1/products", product)
app.use("/api/v1/order", order)

app.use(errorMiddleware)
app.use(notFound)
app.use(errorHandler)