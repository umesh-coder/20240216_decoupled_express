//COllection sCHEMA OF Products


const mongoose = require("mongoose")

const products = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
})

module.exports = mongoose.model("products", products)
