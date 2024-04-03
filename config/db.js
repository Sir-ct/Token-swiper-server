const level = require("level")
const db = new level.Level("./db", {valueEncoding: 'json'})

module.exports = db