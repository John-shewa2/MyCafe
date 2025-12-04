const Order = require('../models/order');

// @desc create a new order
// @route POST /api/orders
// @access Private
const addOrderItems = async (req, res) => {
    const { items, totalCost } = req.body;
    if(items && items.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            items,
            totalCost,
            status: 'ordered'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'username');
    if(order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc calculate monthly bill
// @route GET /api/orders/monthly-bill
// @access Private
const calculateMonthlyBill = async (req, res) => {
    const date = new Date();
    const month = req.query.month || date.getMonth() + 1;
    const year = req.query.year || date.getFullYear();
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const orders = await Order.find({
        user: req.user._id,
        createdAt: { $gte: startDate, $lte: endDate }
    });

    const monthlyTotal = orders.reduce((total, order) => total + order.totalCost, 0);
    res.json({ 
        year,
        month,
        orderCount: orders.length,
        totalBill: monthlyTotal,
        orders });
    };
module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
    calculateMonthlyBill
};