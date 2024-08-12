const express=require('express');
const router = express.Router();
const authController=require(`../controllers/authController`)
const productController=require(`./../controllers/productController`)



router.use(authController.protect)
router.get('/aliasTopProducts',productController.aliasTopProducts,productController.getAllProducts)
router.get('/lastArrivalsProducts',productController.lastArrivalsProducts,productController.getAllProducts)
router.get('/getAll/:categoryId',productController.getProducts)
router.get('/getOne/:productId',productController.getOneProduct)
router.get('/search/:categoryId',productController.search)
//Admin
router.use(authController.restrictTo('admin'))
router.post('/create',productController.uploadProductPhotos,productController.resizeProductImages,productController.addProduct)
router.patch('/update/:productId',productController.uploadProductPhotos,productController.resizeProductImages,productController.updateProduct)
router.delete('/delete/:productId',productController.deleteProduct)


module.exports=router;