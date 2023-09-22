import Stripe from "stripe";
import { app } from "./app.js";
import { connectDb } from "./data/database.js";
import cloundinary from 'cloudinary'

connectDb()

export const stripe = new Stripe(process.env.STRIPE_API_SECRET)

cloundinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.listen(process.env.PORT || 2000, () => {
    console.log(`server listening on port ${process.env.PORT} , in ${process.env.NODE_ENV}`)
})