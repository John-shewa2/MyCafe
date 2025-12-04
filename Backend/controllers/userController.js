const User = require('../models/user');
const generateToken = require('../utils/generateToken');

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
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
        res.status(401);
        throw new Error('Invalid username or password');
    }
};

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        password,
        role
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
            passwordChangeRequired: user.passwordChangeRequired,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const updateUserPassword = async (req, res) => {
    const { newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (user) {
        user.password = newPassword;
        user.passwordChangeRequired = false;
        user.lastPasswordChange = Date.now();

        const updateUser = await user.save();

        res.json({
            _id: updateUser._id,
            username: updateUser.username,
            role: updateUser.role,
            passwordChangeRequired: updateUser.passwordChangeRequired,
            token: generateToken(updateUser._id)
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    authUser,
    registerUser,
    updateUserPassword
};