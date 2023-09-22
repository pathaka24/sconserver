import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { asyncErrorr } from "./error.js";
import jwt from 'jsonwebtoken'

export const isAuthunticated = asyncErrorr(async (req, res, next) => {

    const { token } = req.cookies;
    if (!token) return next(new ErrorHandler("Not Logged In", 401))

    const decodeData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodeData._id)
    console.log("user isAuth:", process.env.JWT_SECRET)

    next()
}
)


export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return res.json({ fail: "Only Admin allowed" })
        next()
    }
    catch (error) {
        console.log(error)
    }
}