const dotenv = require('dotenv');
const path = require('path');

// Setup env
dotenv.config({
    path: path.resolve(__dirname, `../.env`)
});

module.exports = {
    // Server 
    NODE_ENV: process.env.NODE_ENV,
    HOST: process.env.HOST,
    PORT: process.env.PORT || 3000,
    rootDir: path.resolve('./'),
    webURL: process.env.WEB_URL,
    apiVersion: process.env.API_VERSION,
    // Default Secret Key For Auth Token
    JWT_SECRET_KEY: process.env.SECRET_KEY,

    mailer: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        type: 'OAuth2',
        user: process.env.EMAIL_USER, /*User for email services*/
        pass: process.env.EMAIL_PASS, /*Password for email services*/
        secureConnection: true,
        tls: {
            ciphers: 'SSLv3'
        },
        requireTLS: true
    },

    DB: { // Default DB
        DEFAULT_DB_NAME: process.env.DEFAULT_DB_NAME,
        DEFAULT_DB_USER: process.env.DEFAULT_DB_USER,
        DEFAULT_DB_PASS: process.env.DEFAULT_DB_PASS,
        DEFAULT_DB_HOST: process.env.DEFAULT_DB_HOST,
        DEFAULT_DB_PORT: process.env.DEFAULT_DB_PORT,
        DEFAULT_DB_DIALECT: process.env.DEFAULT_DB_DIALECT,
    }
}