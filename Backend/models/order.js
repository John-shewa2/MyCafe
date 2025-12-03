const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            priceAtPurchase: { type: Number, required: true},
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    totalCost: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['order', 'in progress', 'completed', 'cancelled'],
        default: 'order'
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;