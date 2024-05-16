const User = require("@src/models/app/User");
const { serviceResponse } = require("@src/utils/helpers/api_response");

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
        // res.status(500).json({ message: 'Internal server error' });
        return res.status(500).send(new serviceResponse({ status: 500, errors: [{ message: error.message }] }))
    }
}