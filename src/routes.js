// Call Your Routes
const { userRouter } = require("./services/user/Routes");
const ExpressApp = require("express")();
/**
 * 
 * @param {ExpressApp} app 
 */
module.exports = (app) => {
    /* Define Your Routes */
    app.use('/user', userRouter)
}