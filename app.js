// import modules
const express = require("express");
const app = express();
const apiRouterV1 = express.Router()
const morgan = require("morgan");
const cors = require('cors');
const helmet = require("helmet");
const bodyParser = require("body-parser");
const http = require('http');
const compression = require('compression');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/utils/swagger/swagger-output.json');
// Path Alias
require('module-alias/register')

// configs
const { PORT, apiVersion } = require("./config/index");
const { handleCatchError, handleRouteNotFound, handleCors, handlePagination, handleRateLimit } = require("@src/middlewares/express_app");

// application level middlewares
app.use(helmet())
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(compression());
app.use(handleCors)
app.use(handlePagination)
app.use(handleRateLimit)
app.disable('x-powered-by')
app.use(apiVersion, apiRouterV1)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// server status
app.get('/', (req, res) => {
    res.send(`<div align="center" style=""><h1>E-com  Server Ready For Requests. <h1><div>`);
});

// Routes permissions
require("./src/routes")(apiRouterV1)

/* Handle errors */
app.use(handleCatchError)
app.all("*", handleRouteNotFound)

// Create http server
const httpServer = http.createServer(app);

// require("@src/crons/index");
// Listner server
httpServer.listen(PORT, async () => {
    console.log("E-com Server is running on PORT:", PORT);
})  
