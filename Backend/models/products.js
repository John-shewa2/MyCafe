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
        enum: ['Tea', 'Coffee', '2L water', '1/2L water', 'Ginger Tea', 'milk', 'Machiato', 'spris'],
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