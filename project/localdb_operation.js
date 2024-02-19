/**
 * @const express
 * Importing Express
 */

const express = require("express");

const fs = require("fs");

// const read = require("./database");

const app = express();

//port no
const PORT = 8000;

//json for products
const products = require("./database/products.json");

//json for orders

const orders = require("./database/orders.json");

// const read_table = require("./database");

//middleware
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
//Routes

//Routes to print products

// app.get("/products", (req, res) => {
//   return res.json(products);
// });

app.get("/products", (req, res) => {
  const html = `

  <h1><center><b>Products</b></center></h1>

  <style>
   table, th, td {
  border:1px solid black;
}
</style>

  <table>
      <tr><th>product-id</th><th>Name</th><th>Price</th><th>Rating</th><th>Thumbnail</th><th>Description</th></tr>
      ${products
        .map(
          (
            product
          ) => `<tr><td>${product.id}</td><td>${product.title}</td><td>${product.price}</td><td>${product.rating}</td>
          <td><img src='${product.thumbnail}'></img></td><td>${product.description}</td>
          </tr>`
        )
        .join("")}
  </table>
  `;
  res.send(html);
});

/**
 * Search BY Id
 *
 */

// app.get("/products/:id", (req, res) => {
//   // Retrieve the id from params and convert it to a number
//   const id = Number(req.params.id);

//   // Find the product by id
//   const product = products.find((product) => product.id === id);//varname.id alwyas

//   // Check if product exists
//   if (!product) {
//     // If product not found, return 404 status
//     return res.status(404).json({ error: "Product not found" });
//   }

//   // If product found, return it
//   return res.json(product);
// });

//return search by name

/**
 * Search BY Name
 *
 */
app.get("/products/search/:title", (req, res) => {
  // Retrieve the id from params and convert it to a number
  const title = req.params.title;

  // Find the product by name
  const product = products.find((product) => product.title === title); //varname.id alwyas

  const html = `

  <h1><center><b>Products</b></center></h1>

  <style>
   table, th, td {
  border:1px solid black;
}
</style>

  <table>
      <tr><th>product-id</th><th>Name</th><th>Price</th><th>Rating</th><th>Thumbnail</th><th>Description</th></tr>
      <tr><td>${product.id}</td><td>${product.title}</td><td>${product.price}</td><td>${product.rating}</td>
      <td><img src='${product.thumbnail}'></img></td><td>${product.description}</td><td>${product.stock}</td>
      
      </tr>
  </table>
  `;

  // Check if product exists
  if (!product) {
    // If product not found, return 404 status
    return res.status(404).json({ error: "Product not found" });
  }

  // If product found, return it
  return res.send(html);
  return res.json(product);
});

//search Done

//Insert A product
// app.post("/products", (req, res) => {

//   const body=req.body
//   console.log("body:-",body)

//   return res.json({status:"Post Request"})
// });

//insertion of Product
app.post("/products", (req, res) => {
  const body = req.body;
  console.log("body:-", body);

  products.push({ ...body, id: products.length + 1 });

  fs.writeFileSync(
    "./database/products.json",
    JSON.stringify(products),
    (err, data) => {
      return res.json({ status: "Product Added Sucessfully", id: products.length });
    }
  );
  return res.json({ status: "Product Added Sucessfully", id: products.length });
});



app
  .route("/products/:id")
  //update the product details by id
  .put((req, res) => {
    const id = req.params.id;
    const updatedProduct = req.body;
    const index = products.findIndex((product) => product.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }
    products[index] = { ...products[index], ...updatedProduct };

    fs.writeFile(
      "./database/products.json",
      JSON.stringify(products),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        return res.json({
          status: "Product updated successfully",
          product: products[index],
        });
      }
    );
  })

  //delete the product by id
  .delete((req, res) => {
    const id = req.params.id;
    const index = products.findIndex((product) => product.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    products.splice(index, 1);

    fs.writeFile(
      "./database/products.json",
      JSON.stringify(products),
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        return res.json({ status: "Product deleted successfully" });
      }
    );
  });

/**
 *
 * Now Order operations
 *
 */

//print orders in  post

app.post("/orders/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const index = orders.findIndex((order) => order.id === parseInt(id));
  const order = orders.find((order) => order.id === parseInt(id));

  console.log("index:" + index);

  if (!order) {
    // If product not found, return 404 status
    return res.status(606).json({ error: "Order not found" });
  }

  // If product found, return it
  return res.json(order);
});

//update details of orders like status & other details

app.put("/orders/update/:id", (req, res) => {
  const id = req.params.id;
  const update_order = req.body;
  const index = orders.findIndex((order) => order.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  orders[index] = { ...orders[index], ...update_order };

  fs.writeFile("./database/orders.json", JSON.stringify(orders), (err) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json({
      status: "Order updated successfully",
      order: orders[index],
    });
  });
});

//create Order

app.post("/orders", (req, res) => {
  const body = req.body;
  console.log("body:-", body);
  body.id = Math.floor(Math.random() * 9000000000) + 1000000000;
  body.date = new Date().toLocaleString();

  const productId = parseInt(req.params.productId);

 

  //Searching th id
  const index = products.findIndex(
    (product) => product.id === parseInt(productId)
  );

  if (index === -1) {
    return res.status(200).json({ message: "Product added sucessfully" });
  }

  console.log("product id : " + index);

  //current Stock Update

  const currentStock = products[index].stock - parseInt(body.quantity);

  products[index] = { ...products[index], stock: currentStock };

  console.log("Current stock is :- ", currentStock);

  fs.writeFileSync(
    "./database/products.json",
    JSON.stringify(products),
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      return res.json({status: "Product Stock updated successfully",prduct: products[index],
      });
    }
  );

  console.log(
    "\n\n Product Stock updated successfully Stock : " +
      products[index].stock +
      "\n\n"
  );

  body.totalcost = products[index].price * parseInt(body.quantity);

  console.log("\n\n total cost : " + body.totalcost + "\n\n");

  orders.push(body);

  fs.writeFileSync(
    "./database/orders.json",
    JSON.stringify(orders),
    (err, data) => {
      console.log("data : " + data);
    }
  );
  return res.json({
    status: "Order Sucesss ",
    id: Math.floor(Math.random() * 9000000000) + 1000000000,
  });
});

//delete Order

app.delete("/orders/delete/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const index = orders.findIndex((order) => order.id === parseInt(id));
  const order = orders.find((order) => order.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  orders.splice(index, 1);

  fs.writeFile("./database/orders.json", JSON.stringify(orders), (err) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json({ status: "Order deleted successfully", id: order.id });
  });
});

//display orders

app.post("/order", (req, res) => {
  return res.json(orders);
});

app.listen(PORT, () => {
  console.log("Local Database is Live ", { PORT });
});