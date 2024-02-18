//COllection sCHEMA OF orders
const mongoose = require("mongoose");

const orders = new mongoose.Schema({
    productId: String,
    title: String,
    quantity: Number,
    address: String,
    contactNo: Number,
    date: Date,
    status: String,
    totalCost: Number
})

module.exports = mongoose.model("orders", orders);

