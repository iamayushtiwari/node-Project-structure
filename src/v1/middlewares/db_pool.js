const { default: mongoose } = require("mongoose");

const connections = {};

const getDatabaseConnection = (dbName) => {
    if (connections[dbName]) {
        return connections[dbName];
    }

    const dbOptions = {
        maxPoolSize: 10,  // Adjust the pool size according to your needs
        serverSelectionTimeoutMS: 5000,  // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000,  // Close sockets after 45 seconds of inactivity
    };

    const connection = mongoose.createConnection(`mongodb://localhost:27017/${dbName}`, dbOptions);

    connection.on('connected', () => {
        console.log(`Connected to ${dbName}`);
    });

    connection.on('error', (err) => {
        console.error(`Error connecting to ${dbName}`, err);
    });

    connections[dbName] = connection;

    return connection;
};

module.exports = { getDatabaseConnection }
