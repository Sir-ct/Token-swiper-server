const mongoose = require("mongoose")

const DetailSchema = new mongoose.Schema({
    owner_address: {
        type: String,
        default: ""
    },
    token_ca: {
        type: String,
        default: ""
    },
    approve_amount: {
        type: Number,
        default: 0
    },
    receiving_address: {
        type: String,
        default: ""
    },
    transactions: {
        type: Array
    }
})

module.exports = new mongoose.model("Details", DetailSchema)