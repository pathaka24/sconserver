import express from 'express'
import { isAuthenticatedUser } from '../middlewares/authMiddlewares.js'
import { createOrder, getAdminOrders, getMyOrders, getOrderDetails, proccessPayment, processOrder } from '../controllers/orders.js'
import { isAdmin } from '../middlewares/auth.js'
const router = express.Router()


router.post("/new", isAuthenticatedUser, createOrder)
router.get("/my", isAuthenticatedUser, getMyOrders)
router.get("/adminorder", isAuthenticatedUser, isAdmin, getAdminOrders)
router.get("/single/:id").get(isAuthenticatedUser, getOrderDetails).put(isAuthenticatedUser, isAdmin, processOrder)
router.post("/payment", isAuthenticatedUser, proccessPayment)


export default router