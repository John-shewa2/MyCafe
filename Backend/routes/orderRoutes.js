const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById, calculateMonthlyBill } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// create a new order
router.route('/').post(protect, addOrderItems);

// get my orders
router.route('/myorders').get(protect, getMyOrders);

// get monthly bill
router.route('/monthly-bill').get(protect, calculateMonthlyBill);

// get order by ID
router.route('/:id').get(protect, getOrderById);

module.exports = router;

