const express=require('express');
const router = express.Router();
const authController=require(`../controllers/authController`)
const productController=require(`./../controllers/productController`)
const reviewRouter = require(`./reviewRouter`);

router.use('/:itemId/reviews', reviewRouter);
router.use(authController.protect)
router.get('/getAll/:categoryId',productController.getProducts)
router.get('/getOne/:productId',productController.getOneProduct)
router.get('/search/:categoryId',productController.search)
//Admin
router.use(authController.restrictTo('admin'))
router.post('/create',productController.uploadProductPhotos,productController.resizeProductImages,productController.addProduct)
router.patch('/update/:productId',productController.uploadProductPhotos,productController.resizeProductImages,productController.updateProduct)
router.delete('/delete/:productId',productController.deleteProduct)


module.exports=router;