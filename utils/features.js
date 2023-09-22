import DatauriParser from 'datauri/parser.js';
import path from "path"
import { createTransport } from 'nodemailer'
export const getDataUri = (file) => {
    // console.log("data uri:", typeof file.originalname)
    const parser = new DatauriParser();
    const extName = path.extname(file.originalname).toString();
    const file64 = parser.format(extName, file.buffer);
    //console.log("path name:", typeof extName)
    return file64
}

export const imgData = (file) => {
    const parser = new DatauriParser()

    const extName = path.extname(file.originalname).toString()
    //console.log("path name:", typeof extName)
    return parser.format(extName, file.buffer)
}
export const sendToken = (user, res, message, statusCode) => {
    const token = user.generateToken()
    res.status(statusCode).cookie("token", token, {
        secure: process.env.NODE_ENV === 'Development' ? false : true,
        httpOnly: process.env.NODE_ENV === 'Development' ? false : true,
        sameSite: process.env.NODE_ENV === 'Development' ? false : "none",
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }).json({
        success: true,
        message: message,
        token
    })
}


export const sendEmail = async (subject, to, text) => {

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "ab6b961913c261",
            pass: "40bd7a95288d79"
        }
    });
    await transport.sendMail({
        to, subject, text
    })
}

