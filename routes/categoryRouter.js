const express = require('express');
const router = express.Router();
const authController = require(`../controllers/authController`)
const categoryController = require(`../controllers/categoryController`)



// Protect all routes after this middleware
router.use(authController.protect)

router.get('/getCats', categoryController.getCategories)
router.get('/getOneCat/:id', categoryController.getOneCategory)


// Restrict all routes after this middleware
router.use(authController.restrictTo('admin'));

router.post('/create', categoryController.uploadCatPhoto, categoryController.resizeCatPhoto, categoryController.addCategory)
router.patch('/updateCategory/:id', categoryController.uploadCatPhoto, categoryController.resizeCatPhoto, categoryController.updateCategory)
router.delete('/deleteCategory/:id', categoryController.deleteCategory)




module.exports = router;