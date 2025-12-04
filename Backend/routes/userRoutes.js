const express = require('express');
const router = express.Router();
const { authUser, registerUser, updateUserPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// login route
router.post('/login', authUser);

// register route
router.post('/', registerUser);

// update password route
router.put('/password', protect, updateUserPassword);

module.exports = router;
