const User = require('../models/user');
const generateToken = require('../utils/generateToken');

// @desc    Authenticate user & get token
// @route   POST /api/users/login
const authUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            passwordChangeRequired: user.passwordChangeRequired,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, password, role });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Update own password
// @route   PUT /api/users/password
const updateUserPassword = async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        user.password = newPassword;
        user.passwordChangeRequired = false;
        user.lastPasswordChange = Date.now();
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role,
            passwordChangeRequired: updatedUser.passwordChangeRequired,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password'); // Don't send passwords back
    res.json(users);
};

// @desc    Admin reset user password
// @route   PUT /api/users/:id/reset
// @access  Private/Admin
const resetUserPassword = async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.password = newPassword;
        // Optionally force them to change it again
        user.passwordChangeRequired = true; 
        await user.save();
        res.json({ message: 'Password reset successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    authUser,
    registerUser,
    updateUserPassword,
    getUsers,          // <--- New Export
    resetUserPassword  // <--- New Export
};