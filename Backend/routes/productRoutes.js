const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// route to get all products
router.get('/', getProducts);

// route to get a product by ID
router.get('/:id', getProductById);

module.exports = router;