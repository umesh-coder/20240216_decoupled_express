// importing express , http , mogoose

const express = require("express");

const app = express();

const http = require("http").Server(app);

const mongoose = require("mongoose");

// const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://umeshshelare:ecommerce123@ecommerce.vzjccrg.mongodb.net/ecommerce?retryWrites=true&w=majority";

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
mongoose.connect(uri);

const products = require("./models/products");
const orders = require("./models/orders");

//port no
const PORT = 8000;


//print all products

app.get("/product", async (req, res) => {

  const productlist = await products.find()

  return res.json(productlist)
});


//Reading of Product
app.get("/products", async (req, res) => {
  try {
    // Fetch products from MongoDB
    const productList = await products.find();

    const html = `<h1><center><b>Products</b></center></h1>

  <style>
   table, th, td {
  border:1px solid black;
}
</style>

  <table>
      <tr><th>product-id</th><th>Name</th><th>Price</th><th>Rating</th><th>Thumbnail</th><th>Description</th></tr>
      ${productList
        .map(
          (
            products
          ) => `<tr><td>${products.id}</td><td>${products.title}</td><td>${products.price}</td><td>${products.rating}</td>
          <td><img src='${products.thumbnail}'></img></td><td>${products.description}</td>
          </tr>`
        )
        .join("")}
  </table> `;

    // If there are no products, send an appropriate response
    if (!productList || productList.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // If products are found, send them in the response
    res.status(200).send(html);
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Product search By Name
app.get("/products/:title", async (req, res) => {
  try {
    const title1 = req.params.title;

    console.log("Title : " + title1 + "\nType : " + typeof title1);

    //searching for element
    const search_product = await products.find({
      title: title1,
    });

    const html = `<h1><center><b>Products</b></center></h1>
                  <style>
                    table, th, td {
                      border:1px solid black;
                    }
                  </style>
                  <table>
                    <tr><th>Product ID</th><th>Name</th><th>Price</th><th>Rating</th><th>Thumbnail</th><th>Description</th></tr>
                    ${search_product
                      .map(
                        (product) =>
                          `<tr>
                        <td>${product.id}</td>
                        <td>${product.title}</td>
                        <td>${product.price}</td>
                        <td>${product.rating}</td>
                        <td><img src='${product.thumbnail}'></img></td>
                        <td>${product.description}</td>
                      </tr>`
                      )
                      .join("")}
                  </table>`;

    //if item not found show errror
    if (search_product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(search_product);
    //return the search product
    // return res.status(200).send(html);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//product create post request

app.post("/products", async (req, res) => {
  try {
    const newProduct = req.body; // Assuming the new product details are sent in the request body
    console.log(newProduct);
    const createdProduct = await products.create(newProduct);
    res.status(201).json({message:"Product is Added Sucessfully" ,id:createdProduct._id});
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Update post request

app.put("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body; // Assuming updated product details are sent in the request body
    const result = await products.findByIdAndUpdate(productId, updatedProduct, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({message:"Product added sucessfully",id:result._id});
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update delete request product
app.delete("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await products.findByIdAndDelete(productId);
    // console.log("dhbsdbjbjsdbjbf "+productId);
    console.log(deletedProduct);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Order Operation

//Create Order
app.post("/orders/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    console.log("Product ID: " + productId);

    const product = await products.findById(productId);
    console.log("Product Details: ", product);

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    if (req.body.quantity <= 0) {
      return res.status(400).send({ message: "Invalid order quantity." });
    }

    if (req.body.quantity > product.stock) {
      return res.status(400).send({ message: "Insufficient stock." });
    }

    product.stock -= req.body.quantity;
    await product.save();

    const orderDetails = {
      productId: productId,
      title: product.title,
      address: req.body.address,
      quantity: req.body.quantity,
      status: "Pending",
      date:new Date().toLocaleString(),
      totalCost: product.price * parseInt(req.body.quantity),
    };

    const newOrder = await orders.create(orderDetails);
    return res.status(201).send("Order placed successfully.");
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});


// // Update Order (PUT)
app.put("/orders/update/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const updatedOrderData = req.body; // Updated order details sent in the request body

    // Find the order by ID and update it with new data
    const updatedOrder = await orders.findByIdAndUpdate(orderId, updatedOrderData, { new: true });

    // If the order doesn't exist, return a not found response
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send the updated order as a response
    res.status(200).json({message:"Order Updated Sucessfully",id:updatedOrder._id});
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// // Delete Order (DELETE)
app.delete("/orders/delete/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find the order by ID and delete it
    const deletedOrder = await orders.findByIdAndDelete(orderId);

    // If the order doesn't exist, return a not found response
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Order deleted successfully" , id:deletedOrder._id});
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//print all orders

app.post("/order", async (req, res) => {

  const orderslist = await orders.find();

  return res.json(orderslist);
});



http.listen(PORT, () => {
  console.log("Server is ruuning");
});
