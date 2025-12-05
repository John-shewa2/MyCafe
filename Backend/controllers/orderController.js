const Order = require('../models/order');

// @desc    Create new order
const addOrderItems = async (req, res) => {
    const { items, totalCost } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            items,
            totalCost,
            status: 'order'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

// @desc    Get logged in user orders
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get all active orders (For Waiters)
const getActiveOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            status: { $nin: ['completed', 'cancelled'] } 
        })
        .populate('user', 'username')
        .sort({ createdAt: 1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order to delivered
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = 'completed';
            // Save the waiter who performed this action
            order.waiter = req.user._id; 
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel Order
const updateOrderToCancelled = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = 'cancelled';
            // Optionally track who cancelled it too
            order.waiter = req.user._id; 
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Calculate monthly bill (For Admin) with Filtering
const calculateMonthlyBill = async (req, res) => {
    try {
        const date = new Date();
        const month = req.query.month ? parseInt(req.query.month) : date.getMonth() + 1;
        const year = req.query.year ? parseInt(req.query.year) : date.getFullYear();
        
        // Extract filters from query params
        const userId = req.query.userId;
        const waiterId = req.query.waiterId;
        
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Build the query object
        let query = {
            status: 'completed', 
            createdAt: { $gte: startDate, $lte: endDate }
        };

        // Apply filters if they exist
        if (userId) query.user = userId;
        if (waiterId) query.waiter = waiterId;

        const orders = await Order.find(query)
            .populate('user', 'username')
            .populate('waiter', 'username'); // Populate waiter name

        const monthlyTotal = orders.reduce((total, order) => total + order.totalCost, 0);
        
        res.json({ 
            year,
            month,
            orderCount: orders.length,
            totalBill: monthlyTotal,
            orders 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'username')
            .populate('waiter', 'username');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
    calculateMonthlyBill,
    getActiveOrders,
    updateOrderToDelivered,
    updateOrderToCancelled
};