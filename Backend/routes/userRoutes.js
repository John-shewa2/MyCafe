const express = require('express');
const router = express.Router();
const { 
    authUser, 
    registerUser, 
    updateUserPassword,
    getUsers,           // <--- Import
    resetUserPassword   // <--- Import
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Login
router.post('/login', authUser);

// Register & Get Users (Admin functionality)
router.route('/')
    .post(registerUser)
    .get(protect, getUsers); // <--- New GET route for fetching all users

// Update own password
router.put('/password', protect, updateUserPassword);

// Admin reset password route
router.put('/:id/reset', protect, resetUserPassword); // <--- New Route for admin password reset

module.exports = router;