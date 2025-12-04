const express = require('express');
const router = express.Router();
const { getProducts, getProductById, updateProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// route to get all products
router.get('/', getProducts);

// route to get a product by ID
router.get('/:id', getProductById);

// protected route to update a product (admin only)
router.put('/:id', protect, updateProduct);

module.exports = router;