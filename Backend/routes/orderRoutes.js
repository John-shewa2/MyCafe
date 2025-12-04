const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders, 
    getOrderById, 
    calculateMonthlyBill,
    getActiveOrders,
    updateOrderToDelivered,
    updateOrderToCancelled // <--- Import the cancel controller
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// 1. Create Order (POST /api/orders)
router.route('/').post(protect, addOrderItems);

// 2. Get My Orders (GET /api/orders/myorders)
router.route('/myorders').get(protect, getMyOrders);

// 3. WAITER ROUTES: View Active, Mark Delivered, & Cancel
router.route('/active').get(protect, getActiveOrders);
router.route('/:id/deliver').put(protect, updateOrderToDelivered);
router.route('/:id/cancel').put(protect, updateOrderToCancelled); // <--- New Route for Cancellation

// 4. ADMIN ROUTE: Get Monthly Bill (GET /api/orders/monthly-bill)
router.route('/monthly-bill').get(protect, calculateMonthlyBill);

// 5. Get Order by ID (GET /api/orders/:id)
router.route('/:id').get(protect, getOrderById);

module.exports = router;