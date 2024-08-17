const express = require('express');
const router = express.Router();
const authController = require(`../controllers/authController`)
const advertisementController = require('../controllers/advertisementController')


router.use(authController.protect)
router.get('/', advertisementController.get)

router.use(authController.restrictTo('admin'))
router.post('/', advertisementController.uploadAdvPhoto, advertisementController.resizeAdvPhoto, advertisementController.create)
router.route('/:id')
    .patch(advertisementController.uploadAdvPhoto, advertisementController.resizeAdvPhoto, advertisementController.update)
    .delete(advertisementController.delete)




module.exports = router;