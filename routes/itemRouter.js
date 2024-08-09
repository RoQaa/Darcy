const express=require('express');
const router = express.Router();
const authController=require(`./../controllers/authController`)
const itemController=require(`./../controllers/itemController`)
const reviewRouter = require(`./reviewRouter`);



router.use('/:itemId/reviews', reviewRouter);
// Protect all routes after this middleware
router.use(authController.protect)
router.get('/top-5',itemController.aliasTopItems, itemController.getAllItems);
router.get('/getItems',itemController.getItems)
router.get('/getSpecificItem',itemController.getSpecificItem)
router.get('/search',itemController.search)


// Restrict all routes after this middleware
router.use(authController.restrictTo('admin'));
router.get('/getSpecificItem/:id',itemController.getSpecificItemByAdmin)
router.get('/getAllitems/:id',itemController.getAllItemsOfCategoreis)
router.get('/getAllitems',itemController.getAllItems)
router.post('/addItem',itemController.addItem)
router.patch('/updateItem/:id',itemController.uploadProductPhotos,itemController.resizeProductImages,itemController.updateItem)
router.delete('/deleteItem/:id',itemController.deleteItem)




module.exports=router;