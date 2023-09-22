import express from 'express'
import { changePassword, forgetPassword, getMyProfile, logOut, login, resetPassword, signup, updatePic, updateProfile } from '../controllers/user.js'
import { isAuthenticatedUser } from '../middlewares/authMiddlewares.js'
import { singleUpload } from '../middlewares/multer.js'



const router = express.Router()

router.get("me", () => {

})
router.post("/login", login)
router.post('/signup', singleUpload, signup)
router.get('/me', isAuthenticatedUser, getMyProfile)
router.get("/logout", isAuthenticatedUser, logOut)
router.put("/updateProfile", isAuthenticatedUser, updateProfile)

router.put("/changePassword", isAuthenticatedUser, changePassword)
router.put("/updatepic", isAuthenticatedUser, singleUpload, updatePic)
router.route('/forgotpassword').post(forgetPassword).put(resetPassword)


export default router

