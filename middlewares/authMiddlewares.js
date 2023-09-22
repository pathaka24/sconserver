import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const isAuthenticatedUser = async (req, res, next) => {

    try {
        const { token } = req.cookies;

        if (!token) {
            return next(new ErrorHandler("Please Login to access this resource", 401));
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedData._id);
        console.log(req.user)
        next();
    }

    catch (err) {
        console.log(err)
    }

};