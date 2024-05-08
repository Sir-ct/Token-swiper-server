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
    current_chain: {
        type: String,
        default: "sepolia"
    },
    current_chain_rpc: {
        type: String,
        default: "wss://sepolia.gateway.tenderly.co"
    },
    transactions: {
        type: Array
    }
})

module.exports = new mongoose.model("Details", DetailSchema)