const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shopController');
const authController = require('../controllers/authController')

// Product routes
router.get('/products', shopController.getAllProducts);
router.get('/products/:id', shopController.getProductById);
router.post('/product', shopController.addProduct);

// Cart routes
router.post('/cart', authController.verifyToken, shopController.addToCart);
router.put('/cart/:id', authController.verifyToken, shopController.updateCartItem);
router.delete('/cart/:id', authController.verifyToken, shopController.removeFromCart);

// User routes
router.post('/register', shopController.registerUser);
router.post('/login', shopController.loginUser);

module.exports = router;
