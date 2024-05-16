const dotenv = require('dotenv');
const path = require('path');

// Setup env
dotenv.config({
    path: path.resolve(__dirname, `../.env`)
});

module.exports = {
    // Server 
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
    rootDir: path.resolve('./'),
    apiVersion: process.env.API_VERSION,
    // Default Secret Key For Auth Token
    JWT_SECRET_KEY: process.env.SECRET_KEY,
    connection_string: process.env.CONNECTION_STRING,

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
}