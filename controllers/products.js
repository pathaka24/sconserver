
import { Product } from "../models/product.js"



export const getAllProducts = async (req, res, next) => {

    try {
        const product = await Product.find({})
        console.log("My Product")
        return res.status(200).json({
            success: true,
            product
        })

    } catch (err) {
        console.log(err)
    }


}