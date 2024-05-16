const { errorLogger } = require("@config/logger");
const User = require("@src/models/app/User");
const { serviceResponse } = require("@src/utils/helpers/api_response");
const bcrypt = require('bcryptjs');

module.exports.register = async (req, res) => {
    try {
        const { name, username, email, password, mobile_number } = req.body;

        const existingUser = await User.findOne({ $or: [{ mobile_number }, { username }, { email }] });
        if (existingUser) {
            return res.status(403).send(new serviceResponse({ status: 403, message: 'Username or email already exists' }))
        }
        const newUser = new User({ name, username, email, password, mobile_number });
        await newUser.save();
        res.status(201).send(new serviceResponse({ status: 201, data: newUser, message: 'User registered successfully' }))
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).send(new serviceResponse({ status: 500, errors: [{ message: error.message }] }))
    }
}

module.exports.login = async (re, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Set up session upon successful login
        req.session.user = { id: user._id, username: user.username };
        res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.error('Error logging in:', error);
        errorLogger.error({ meaage: error.message, stack: error.stack })
        return res.status(500).send(new serviceResponse({ status: 500, errors: [{ message: error.message }] }))
    }
}