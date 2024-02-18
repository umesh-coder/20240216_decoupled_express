//COllection sCHEMA OF orders
const mongoose = require("mongoose");

const orders = new mongoose.Schema({
    productId: Number,
    quantity: Number,
    address: String,
    contactNo: String,
    date: Date,
    status: String,
    totalCost: Number
})

module.exports = mongoose.model("orders", orders);

