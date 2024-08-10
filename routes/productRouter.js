const express=require('express');
const router = express.Router();
const authController=require(`../controllers/authController`)
const productController=require(`./../controllers/productController`)
const reviewRouter = require(`./reviewRouter`);



router.use('/:productId/reviews', reviewRouter);
// Protect all routes after this middleware
router.use(authController.protect)
router.get('/top-5',productController.aliasTopProducts, productController.getAllProducts);
router.get('/getProducts',productController.getProducts)
router.get('/getSpecificProduct',productController.getSpecificProduct)
router.get('/search',productController.search)


// Restrict all routes after this middleware
router.use(authController.restrictTo('admin'));
router.get('/getSpecificProduct/:id',productController.getSpecificProductByAdmin)
router.get('/getAllproducts/:id',productController.getAllProductsOfCategoreis)
router.get('/getAllproducts',productController.getAllProducts)
router.post('/addProduct',productController.addProduct)
router.patch('/updateProduct/:id',productController.uploadProductPhotos,productController.resizeProductImages,productController.updateProduct)
router.delete('/deleteProduct/:id',productController.deleteProduct)




module.exports=router;