const express = require('express');
const { register, login, resetPassword, sendResetPage, forgot_password, logout } = require('./Controller');
const { body } = require('express-validator');
const { validateErrors } = require('@src/utils/helpers/express_validator');
const { verifyJwtToken } = require('@src/middlewares/jwt');
const userRouter = express.Router();


userRouter.post('/register', [
    body('name', "name can't be null").notEmpty().isString().not().trim(),
    body('username', "username can't be null").notEmpty().isString().not().trim(),
    body('email', "email can't be null").notEmpty().isEmail().not().withMessage("email is not in valid format").trim(),
    body('mobile_number', "mobile_number can't be null").notEmpty().isMobilePhone().not().withMessage("mobile_numberF is not in valid format").trim(),
    body('password', "password can't be null").notEmpty().trim()
], validateErrors, register)

userRouter.post('/login', [
    body('username', "username can't be null").notEmpty().isString().not().trim(),
    body('password', "password can't be null").notEmpty().trim()
], validateErrors, login)

userRouter.post('/logout', verifyJwtToken, logout)

userRouter.post('/forgot-password', [
    body('email', "email can't be null").notEmpty().isEmail().not().withMessage("email is not in valid format").trim(),
], validateErrors, forgot_password)
userRouter.get('/reset/:token', sendResetPage);
userRouter.post('/reset/:token', resetPassword);

module.exports = { userRouter }