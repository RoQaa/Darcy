const express = require('express');
const router = express.Router();
const authController = require(`../controllers/authController`)
const userController = require(`../controllers/userController`)

router.post('/signUp', authController.SignUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword)
router.post('/verifyEmailOtp', authController.verifyEmailOtp)
// Protect all routes after this middleware

router.use(authController.protect)
//Auth Routes
router.patch('/resetPassword', authController.resetPassword)
router.patch('/updatePassword', authController.updatePassword)
router.get('/logout', authController.logOut)

//user Routes
router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateUser)
router.get('/profilePage', userController.profilePage)
router.delete('/deleteMyAccount', userController.deleteMyAccount)



// Restrict all routes after this middleware
router.use(authController.restrictTo('admin'));

router.patch('/updateUser/:id', userController.updateUserByAdmin)
router.delete('//:id', userController.deleteUser)
router.post('/createAccount', userController.creataAccount)
router.get('/getUsers', userController.getUsers)
router.get('/getUsers/:id', userController.getUsers)
router.get('/search', userController.search)

module.exports = router;