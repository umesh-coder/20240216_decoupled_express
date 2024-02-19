const express = require("express");

const app = express();

const http = require("http").Server(app);


const PORT = 9000;


//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//mongo connection Schema

const products = require("./models/products");
const orders = require("./models/orders");

//mongo connection end


//local db connection

//json for products & orders
const lproducts = require("./database/products.json");
const lorders = require("./database/orders.json");

const fs = require("fs");

//local db connection end



//database calling


mongoDB=require('./mongodb_operation')
// localdb=require('./localdb_operation')


http.listen(PORT, () => {
  console.log("Main Server is running");
});



