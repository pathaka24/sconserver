import express, { json } from 'express'
import { isAuthenticatedUser } from '../middlewares/authMiddlewares.js'
import { singleUpload } from '../middlewares/multer.js'
import { addCategory, addProductImage, createProduct, deleteCategory, deleteProduct, deleteProductImage, getAdminProducts, getAllCategories, getProducts, getProductsDetails, updateProduct } from '../controllers/productController.js'
import { isAdmin } from '../middlewares/auth.js'





const router = express.Router()

router.get("/all", getProducts)
router.get("/admin", isAuthenticatedUser, isAdmin, getAdminProducts)
router.route('/productDetail/:id').get(getProductsDetails).put(isAuthenticatedUser, isAdmin, updateProduct).delete(isAuthenticatedUser, isAdmin, deleteProduct)
router.post("/new", isAuthenticatedUser, isAdmin, singleUpload, createProduct)
router.route("/images/:id").post(isAuthenticatedUser, singleUpload, addProductImage).delete(deleteProductImage)

router.route("category").post(isAuthenticatedUser, isAdmin, addCategory).get(getAllCategories)
router.delete("category/:id", isAuthenticatedUser, isAdmin, deleteCategory)



export default router
