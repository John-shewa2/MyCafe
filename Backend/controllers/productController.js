const Product = require('../models/products');

// @desc fetch all products
// @route GET /api/products
// @access Public
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc fetch single product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc Update product price
// @route PUT /api/products/:id
// @access Private (Admin)
const updateProduct = async (req, res) => {
    const { price } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (product) {
        product.price = price;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    updateProduct
};