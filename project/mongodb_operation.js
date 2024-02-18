// importing express , http , mogoose

const express = require("express")

const app = express();

const http = require("http").Server(app);

const mongoose = require("mongoose");

// const { MongoClient } = require("mongodb");

const uri ="mongodb+srv://umeshshelare:ecommerce123@ecommerce.vzjccrg.mongodb.net/ecommerce?retryWrites=true&w=majority";

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
mongoose.connect(uri);

const products = require("./models/products");
const orders = require("./models/orders");




//port no
const PORT = 8000;

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
                    ${search_product.map(product => 
                      `<tr>
                        <td>${product.id}</td>
                        <td>${product.title}</td>
                        <td>${product.price}</td>
                        <td>${product.rating}</td>
                        <td><img src='${product.thumbnail}'></img></td>
                        <td>${product.description}</td>
                      </tr>`
                    ).join("")}
                  </table>`;
    

    //if item not found show errror
    if (search_product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // return res.status(200).json(search_product);
    //return the search product
    return res.status(200).send(html)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" })
  }
})


//product create post request

app.post("/products", async (req, res) => {
  try {
    const newProduct = req.body; // Assuming the new product details are sent in the request body
    console.log(newProduct);
    const createdProduct = await products.create(newProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

//Update post request

app.put("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = req.body; // Assuming updated product details are sent in the request body
    const result = await products.findByIdAndUpdate(productId, updatedProduct, { new: true });
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update delete request
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
    res.status(500).json({ message: "Internal server error" })
  }
});




http.listen(PORT, () => {
  console.log("Server is ruuning")
})
