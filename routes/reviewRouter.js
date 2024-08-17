const express = require('express');
const router = express.Router();
const authController = require(`../controllers/authController`)
const reviewController = require(`../controllers/reviewController`)

router.use(authController.protect)

router.get('/getReviews/:productId', reviewController.getReviews)
router.post('/addReview', reviewController.addReviews)

router.patch('/updateUserReview/:reviewId', reviewController.updateUserReview)
router.delete('/deleteUserReview/:reviewId', reviewController.deleteUserReview)


router.use(authController.restrictTo('admin',))
router.patch('/updateReview/:id', reviewController.updateReview)
router.delete('/deleteReview/:id', reviewController.deleteReview)
module.exports = router;