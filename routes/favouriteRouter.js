const express = require('express');
const router = express.Router();
const authController = require(`../controllers/authController`)
const favouriteController = require(`../controllers/favouriteController`)

// Protect all routes after this middleware
router.use(authController.protect)
router.post('/addFav', favouriteController.addFavs);
router.get('/getFavs', favouriteController.getFavs);
router.delete('/delete/:id', favouriteController.deleteFav);

module.exports = router;