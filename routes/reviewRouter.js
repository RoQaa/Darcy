const express=require('express');
const router = express.Router();
const authController=require(`${__dirname}/../controllers/authController`)
const reviewController=require(`${__dirname}/../controllers/reviewController`)

router.use(authController.protect)

router.get('/getReviews',reviewController.getReviews)
router.post('/addReview',reviewController.addReviews)

router.patch('/updateUserReview',reviewController.updateUserReview)
router.delete('/deleteUserReview',reviewController.deleteUserReview)


router.use(authController.restrictTo('admin','manger'))
router.patch('/updateReview/:id',reviewController.updateReview)
router.delete('/deleteReview/:id',reviewController.deleteReview)
module.exports=router;