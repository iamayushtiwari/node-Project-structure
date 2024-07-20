// Call Your Routes
const { S3Router } = require("./services/aws/routes");
const { templateRoutes } = require("./services/templete/Routes");
const { userRouter } = require("./services/auth/Routes");
const ExpressApp = require("express")();
/**
 * 
 * @param {ExpressApp} app 
 */
module.exports = (app) => {
    /* Define Your Routes */
    app.use('/auth', userRouter)
    app.use('/aws', S3Router)
    app.use('/import-templete', templateRoutes)
}