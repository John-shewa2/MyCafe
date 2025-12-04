const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        // Using broader categories that match the seed data in productData.js
        enum: ['Hot Drinks', 'Water', 'Snacks'],
        required: true
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;