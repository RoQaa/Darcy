const express=require('express');
const router = express.Router();
const authController=require(`../controllers/authController`)
const orderController=require('../controllers/orderController')

router.use(authController.protect);

router.post('/create',orderController.createOrder);
router.get('/getOrders',orderController.getAllOrders);


module.exports=router;