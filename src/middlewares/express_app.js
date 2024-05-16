const { serviceResponse } = require("@src/utils/helpers/api_response")
const { rateLimit } = require("express-rate-limit")

module.exports = {
    handleCatchError: (err, req, res, next) => {
        try {
            let { status, error } = JSON.parse(err)
            // Your Error Handling Here
            return res.send(new serviceResponse({ status: status, errors: [{ message: error }] }))
        } catch (err) {
            return res.send(new serviceResponse({ status: 500, errors: [{ message: err.message }] }))
        }
    },

    handleRouteNotFound: (req, res) => {
        try {
            return res.send(new serviceResponse({ status: 404, errors: "Route not found." }))
        } catch (err) {
            return res.send(new serviceResponse({ status: 404, errors: err.message }))
        }
    },

    handleCors: (req, res, next) => {
        try {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        } catch (err) {
            return res.send(new serviceResponse({ status: 404, errors: err.message }))
        }
    },

    handlePagination: (req, res, next) => {
        try {
            let maxLimit = 100;
            let { limit, page, paginate = 1 } = req.query;
            let offset = 0;
            if (limit && page) {
                limit = limit <= maxLimit ? limit : maxLimit
                offset = (page - 1) * limit
            }
            req.query.limit = limit ? parseInt(limit) : 10;
            req.query.page = page ? parseInt(page) : 1;
            req.query.offset = offset ? parseInt(offset) : 0;
            req.query.paginate = paginate == 0 ? 0 : 1;
            next();
        } catch (err) {
            return res.send(new serviceResponse({ status: 404, errors: err.message }))
        }
    },
    handleRateLimit: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minutes
        max: 50, // Limit each IP to 5 requests per `window` (here, per 1 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        handler: (req, res, next, options) => {
            return res.send(new serviceResponse({ status: options.statusCode, errors: [{ message: options.message }] }))
        }
    })
}
