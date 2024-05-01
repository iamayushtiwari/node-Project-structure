// Call Your Routes

const { example } = require("./services/example/Routes");



const ExpressApp = require("express")();
/**
 * 
 * @param {ExpressApp} app 
 */
module.exports = (app) => {
    /* Define Your Routes */
    app.use('/example', example)
}