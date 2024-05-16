const jwt = require('jsonwebtoken');
const { serviceResponse } = require('@src/utils/helpers/api_response');
const { _auth_module } = require('@src/utils/constants/messages');
const { JWT_SECRET_KEY } = require('@config/index');

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {import('express').NextFunction} next 
 * @returns 
 */
const verifyJwtToken = function (req, res, next) {
    let authorization = req.headers.authorization;
    if (authorization) {
        var tokenBearer = authorization.split(' ');
        var token = tokenBearer[1];

        jwt.verify(token, JWT_SECRET_KEY, async function (err, decoded) {
            if (err) {
                return res.status(403).json(new serviceResponse({ status: 403, errors: _auth_module.unAuth }));
            }
            else {
                // Set Your Token Keys In Request
                Object.entries(decoded).forEach(([key, value]) => {
                    req[key] = value
                })
                next();
            }
        });
    }
    else {
        return res.status(403).send(new serviceResponse({ status: 403, errors: _auth_module.tokenMissing }));
    }
};

const verifyBasicAuth = async function (req, res, next) {
    try {
        const authheader = req.headers.authorization;

        if (!authheader) {
            res.setHeader('WWW-Authenticate', 'Basic');
            return res.status(401).json(new serviceResponse({ status: 401, errors: _auth_module.unAuth }));
        }

        const auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
        const user = auth[0];
        const pass = auth[1];

        if (user && pass) {
            // Match User & Pass from DB
            next();
        } else {
            res.setHeader('WWW-Authenticate', 'Basic');
            return res.status(401).json(new serviceResponse({ status: 401, errors: _auth_module.unAuth }));
        }
    } catch (error) {
        return res.status(500).json(new serviceResponse({ status: 500, errors: error.message }));
    }
}

module.exports = {
    verifyJwtToken,
    verifyBasicAuth
}