const { errorLogger } = require("@config/logger");
const { getAssoicatedModel } = require("@src/v1/models/Associations");
// const { redisClient } = require("@config/redis");
const { User } = require("@src/v1/models/app/User");
const { serviceResponse } = require("@src/v1/utils/helpers/api_response");
const { asyncErrorHandler } = require("@src/v1/utils/helpers/asyncErrorHandler");
const { generateJwtToken, decryptJwtToken } = require("@src/v1/utils/helpers/jwt");
const { sendMail } = require("@src/v1/utils/helpers/node_mailer");
const bcrypt = require('bcryptjs');

module.exports.register = asyncErrorHandler(
    async (req, res) => {
        const { name, username, email, password, mobile_number } = req.body;

        const existingUser = await User.findOne({ $or: [{ mobile_number }, { username }, { email }] });
        // console.log(await redisClient.get(existingUser.id))
        if (existingUser) {
            return res.status(403).send(new serviceResponse({ status: 403, message: 'Username or email already exists' }))
        }
        const newUser = new User({ name, username, email, password, mobile_number });
        await newUser.save();
        res.status(201).send(new serviceResponse({ status: 201, data: {}, message: 'User registered successfully' }))
    }
)

module.exports.login = asyncErrorHandler(
    async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        delete user._doc.password
        delete user._doc.updatedAt

        const token = generateJwtToken(user._doc)
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 360000, });
        // await redisClient.setEx(user.id, 3600, JSON.stringify(user._doc))

        res.status(200).json({ message: 'Login successful', user: user });

    }
)

module.exports.logout = asyncErrorHandler(
    async (req, res, next) => {
        const { tenantDB } = getAssoicatedModel('companyabc')
        res.clearCookie("token");
        return res.status(200).json({ message: 'logout successful' });
    }
)

// } catch (error) {
//     console.error('Error logging in:', error);
//     errorLogger.error({ message: error.message, stack: error.stack })
//     return res.status(500).send(new serviceResponse({ status: 500, errors: [{ message: error.message }] }))
// }

module.exports.forgot_password = asyncErrorHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user with provided email exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    // Generate token
    const token = generateJwtToken(user)

    // Send email with password reset link
    await sendMail(user.email, '', 'Password Reset', `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/v1/user/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n </p>`)
    return res.status(201).send(new serviceResponse({ status: 201, message: 'Please check your register mail' }))
})



module.exports.sendResetPage = asyncErrorHandler(async (req, res, next) => {
    const token = req.params.token;

    // Find user with the provided token and check if token is still valid
    const decryptToken = await decryptJwtToken(token)
    if (decryptToken?.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ username: decryptToken?.data._doc.username });

    if (!user) {
        return res.status(400).json({ message: 'user not found' });
    }

    // Render a form for the user to reset their password
    res.send(`
            <form action="/v1/user/reset/${token}" method="post">
                <input type="password" name="password" placeholder="Enter new password" required />
                <input type="password" name="confirmPassword" placeholder="Confirm new password" required />
                <button type="submit">Reset Password</button>
            </form>
        `);
})

module.exports.resetPassword = asyncErrorHandler(async (req, res) => {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;

    // Find user with the provided token and check if token is still valid
    const decryptToken = await decryptJwtToken(token)
    if (decryptToken?.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ username: decryptToken?.data._doc.username });

    if (!user) {
        return res.status(400).json({ message: 'user not found' });
    }

    // Validate passwords
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Update user's password and clear reset token
    user.password = password;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
})