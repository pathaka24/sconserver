import { Order } from '../models/order.js'
import { Product } from "../models/product.js"
import { stripe } from '../server.js'




export const proccessPayment = async (req, res, next) => {
    try {
        const { totalAmount } = req.body
        const { client_secret } = await stripe.paymentIntents.create({
            amount: Number(totalAmount * 100),
            currency: "inr"
        })
        res.status(200).json({
            success: true,
            client_secret
        })
    }
    catch (error) {
        console.log(error)
    }
}



export const createOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentMethods,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount
        } = req.body
        await Order.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            paymentMethods,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            shippingCharges,
            totalAmount
        })
        for (let index = 0; index < orderItems.length; index++) {
            const product = await Product.findById(orderItems[i].product)
            product.Stock = orderItems[index].quantity
            await product.save()
        }
        res.status(201).json({
            success: true,
            message: "Order Placed Successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        console.log(error)
    }
}

export const getOrderDetails = async (req, res, next) => {
    try {
        const orders = await Order.findById(req.params.id)
        res.status(200).json({
            success: true,
            orders
        })
        if (!orders) return res.json({ message: "Order not found" })
    } catch (error) {
        console.log(error)
    }
}

export const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
        res.status(200).json({
            success: true,
            orders
        })
        const outOfStock = orders.filter((i) => i.Stock === 0)
        res.status(200).json({
            success: true,
            orders,
            outOfStock: outOfStock.length,
            inStock: orders.length - outOfStock.length
        })

    } catch (error) {
        console.log(error)
    }
}

export const processOrder = async (req, res, next) => {
    try {
        const orders = await Order.findById(req.params.id)

        if (!orders) return res.json({ message: "No Order Found" })
        if (orders.orderStatus === "Preparing") orders.orderStatus = "Shipped"
        else if (orders.orderStatus === "Shipped") {
            orders.orderStatus = "Delivered"
            orders.deliveredAt = new Date(Date.now())
        } else return res.json({ messes: "Order Already Delivered" })

        await orders.save()
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        console.log(error)
    }
}