// getting-started.js
const mongoose = require('mongoose');
const connection = mongoose.connection
// const connection_string = 


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/node-project');
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