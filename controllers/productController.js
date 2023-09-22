import { Category } from "../models/category.js"
import { Product } from "../models/product.js"
import { getDataUri } from "../utils/features.js"
import cloudinary from 'cloudinary'


export const getProducts = async (req, res, next) => {

    try {
        const { keyword, category } = req.query

        const product = await Product.find({
            name: {
                $regex: keyword ? keyword : "",
                $options: "i"
            },
            category: category ? category : undefined
        })
        console.log("My Product")
        return res.status(200).json({
            success: true,
            product
        })

    } catch (err) {
        console.log(err)
    }


}
export const createProduct = async (req, res, next) => {

    try {
        const { name, description, category, price, stock } = req.body

        if (!req.file) return res.json({ message: "Please add image" })

        const file = getDataUri(req.file)

        const myCLoud = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: myCLoud.public_id,
            url: myCLoud.secure_url
        }
        await Product.create({
            name, description, category, price, stock, images: [image]
        })
        return res.status(200).json({
            success: true,
            message: "Product Created successfully"
        })

    } catch (err) {
        console.log(err)
    }


}

export const getProductsDetails = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id).populate("category")

        if (!product) return res.json({ product: "Product Not Foubd" })
        console.log("My Product")
        return res.status(200).json({
            success: true,
            product
        })

    } catch (err) {
        console.log(err)
    }


}

export const updateProduct = async (req, res, next) => {
    try {
        const { name, description, category, price, stock } = req.body
        const product = await Product.findById(req.params.id)
        if (!product) return res.json({ message: "Product Not Found" })

        if (name) product.name = name
        if (description) product.description = description
        if (category) product.category = category
        if (price) product.price = price
        if (stock) product.Stock = stock

        await product.save()

        res.status(200).json({
            success: true,
            message: "Product saved successfully"
        })

    } catch (err) {
        console.log(err)
    }
}


export const addProductImage = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.json({ message: "Product Not Found" })


        if (!req.file) return res.json({ message: "Please add image" })

        const file = getDataUri(req.file)

        const myCLoud = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: myCLoud.public_id,
            url: myCLoud.secure_url
        }
        product.images.push(image)
        await product.save()
        return res.status(200).json({
            success: true,
            message: "PImage Created successfully"
        })

    } catch (err) {
        console.log(err)
    }


}


export const deleteProductImage = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.json({ message: "Product Not Found" })

        const id = req.query.id
        if (!id) return res.json({ message: "Please Image Id" })
        let isExist = -1
        product.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) isExist = index
        })

        if (isExist < 0) return res.json({ message: "Image does not exist" })

        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)

        product.images.splice(isExist, 1)
        product.save()
        return res.status(200).json({
            success: true,
            message: "Image Delete successfully"
        })

    } catch (err) {
        console.log(err)
    }


}
export const deleteProduct = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id)
        if (!product) return res.json({ message: "Product Not Found" })

        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
        }




        product.remove()
        return res.status(200).json({
            success: true,
            message: "Product Delete successfully"
        })

    } catch (err) {
        console.log(err)
    }


}


export const addCategory = async (req, res, next) => {
    try {
        await Category.create(req.body)

        res.status(201).json({
            success: true,
            message: "Category created successfully"
        })
    }
    catch (error) {
        console.log(error)
    }
}

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({})
        res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)
        if (!category) return res.json({ message: "Category not found" })
        const products = await Product.find({ category: category._id })
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            product.category = undefined
            await product.save()
        }

        await category.remove()
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAdminProducts = async (req, res, next) => {

    try {
        const product = await Product.find({}).populate("category")
        console.log("My Product")
        return res.status(200).json({
            success: true,
            product
        })

    } catch (err) {
        console.log(err)
    }
}