// getting-started.js
const mongoose = require('mongoose');
const connection = mongoose.connection
const { connection_string } = require('.');


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(connection_string);
}

connection.on('error', console.error.bind(console, "Error unable to connect database...!"));

connection.once('open', function (error) {
    if (error) {
        console.log('unable to connect database...!', err)
    } else {
        console.log("Connected MongoDB Successfully...!",)
    }
})
module.exports = { connection };