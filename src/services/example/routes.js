const express = require("express")
const example = express.Router()

example.get('/', (req, res) => {
    // #swagger.tags = ['example']
    const { a } = req.query
    return res.send("checked...!")
})
example.post('/', (req, res) => {
    // #swagger.tags = ['example']
    const { a } = req.body
    console.log(a);
    return res.send("checked...!")
})

module.exports = { example }