import { asyncErrorr } from '../middlewares/error.js'
import { User } from '../models/user.js'
import ErrorHandler from '../utils/error.js'
import { getDataUri, imgData, sendEmail, sendToken } from '../utils/features.js'
import cloudinary from 'cloudinary'
import DatauriParser from 'datauri/parser.js';
import path from "path"


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select("+password")

        const isMathed = await user.comparePassword(password)

        if (!isMathed) {
            return res.json({ message: "User Name or Password incorrect" })


        }
        const token = user.generateToken()
        res.status(200).cookie("token", token, {
            secure: process.env.NODE_ENV === 'Development' ? false : true,
            httpOnly: process.env.NODE_ENV === 'Development' ? false : true,
            sameSite: process.env.NODE_ENV === 'Development' ? false : "none",
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }).json({
            success: true,
            message: `welcome to here ,${user.name}`,
            token
        })
    }
    catch (error) {
        console.log(error)
    }

}


export const signup = async (req, res, next) => {
    try {
        const { email, password, name, city, address, country, pincode } = req.body

        let avatar = undefined


        const parser = new DatauriParser();
        const extName = path.extname(req.file.originalname).toString();
        const file64 = parser.format(extName, req.file.buffer);


        const file = getDataUri(req.file)
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        const myCLoud = await cloudinary.v2.uploader.upload(file.content)
        avatar = {
            public_id: myCLoud.public_id,
            url: myCLoud.secure_url
        }


        // console.log(myCLoud.secure_url)
        let userCheck = await User.findOne({ email })
        if (userCheck) return res.json({ user: "Already Exists" })



        const user = await User.create({
            name,
            email,
            password,
            address,
            city,
            country,
            pincode,
            avatar
        })


        const token = user.generateToken()
        res.status(200).cookie("token", token, {
            secure: process.env.NODE_ENV === 'Development' ? false : true,
            httpOnly: process.env.NODE_ENV === 'Development' ? false : true,
            sameSite: process.env.NODE_ENV === 'Development' ? false : "none",
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }).json({
            success: true,
            message: `welcome to here ,${user.name}`,
            token
        })

    }
    catch (error) {
        console.log(error)
    }
}

export const getMyProfile = asyncErrorr(async (req, res, next) => {

    const user = await User.findById(req.user._id)




    return res.status(200).json({
        success: true,
        user
    })
})

export const logOut = asyncErrorr(async (req, res, next) => {
    res.status(200).cookie("token", {
        secure: process.env.NODE_ENV === 'Development' ? false : true,
        httpOnly: process.env.NODE_ENV === 'Development' ? false : true,
        sameSite: process.env.NODE_ENV === 'Development' ? false : "none",
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Logged Out Successfully"
    })
})

export const updateProfile = asyncErrorr(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const { name, email, address, city, country, pincode } = req.body;

    if (name) user.name = name
    if (email) user.email = email
    if (address) user.address = address
    if (city) user.city = city
    if (country) user.country = country
    if (pincode) user.pincode = pincode

    await user.save()
    res.json({
        success: true,
        message: "Profile Updated Successfully",
        user
    })
})

export const changePassword = asyncErrorr(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password")
    const { oldPassword, newPassword } = req.body

    const isMathed = await user.comparePassword(oldPassword)

    if (!isMathed) return next(new ErrorHandler("incorrect password"))

    user.password = newPassword

    await user.save()

    res.status(200).json({
        success: true,
        message: "Password Changed Successully"
    })

})


export const updatePic = asyncErrorr(async (req, res, next) => {

    const user = await User.findById(req.user._id)


    const file = getDataUri(req.file)
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    const myCLoud = await cloudinary.v2.uploader.upload(file.content)
    user.avatar = {
        public_id: myCLoud.public_id,
        url: myCLoud.secure_url
    }

    await user.save()
    return res.status(200).json({
        success: true,
        message: "Image uploaded successfully"
    })
})

export const forgetPassword = asyncErrorr(async (req, res, next) => {

    const { email } = req.body
    const user = await User.findOne({ email })

    const randomNumber = Math.random() * (999999 - 100000) + 100000
    const otp = Math.floor(randomNumber)
    const otp_expire = 15 * 60 * 1000

    user.otp = otp
    user.otp_expire = new Date(Date.now() + otp_expire)

    await user.save()
    console.log(otp)
    const message = `Your OTP for reseting password is ${otp}.\n Please ignore if you haven't requested this`
    try {
        await sendEmail("Otp For Resetting Password", user.email, message)
    } catch (error) {
        user.otp = null;
        user.otp_expire = null
        await user.save()
        return res.json({ message: error })
    }
    return res.status(200).json({
        success: true,
        message: "Email sent s"
    })
})

export const resetPassword = asyncErrorr(async (req, res, next) => {

    const { otp, password } = req.body

    const user = await User.findOne({
        otp,
        otp_expire: {
            $gt: Date.now()
        }

    })

    if (!user) return next(new ErrorHandler("Incorrect OTP"))

    user.password = password
    user.otp = undefined
    user.otp_expire = undefined

    await user.save()




    return res.status(200).json({
        success: true,
        message: "Password Changed"
    })
})