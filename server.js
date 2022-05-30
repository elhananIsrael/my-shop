const express = require("express");
// const res = require("express/lib/response");
// const { json } = require("express/lib/response");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
require("dotenv").config();
// var cors = require("cors");

function isEmpty(obj) {
  for (var x in obj) {
    return false;
  }
  return true;
}

//Serve static files from the React app
app.use(express.static("client/build"));

// // use it before all route definitions
// // app.use(cors({ origin: "http://localhost:8000" }));
// app.use(cors({ origin: "*" }));

app.use(express.json());

try {
  const productSchema = new mongoose.Schema({
    // id: mongoose.ObjectId,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    rating: new mongoose.Schema({ rate: Number, count: Number }),
    quantity: Number,
  });

  const Product = mongoose.model("Product", productSchema);

  // app.get("/", (req, res) => {
  //   res.send("Hello World!");
  // });

  app.get("/api/products", (req, res) => {
    const {
      title,
      price,
      minPrice,
      maxPrice,
      description,
      category,
      image,
      rating,
      quantity,
    } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: new RegExp(title, "i") };
    }
    if (price && !(minPrice && maxPrice)) {
      query.price = price;
    }
    if (minPrice && maxPrice && !price) {
      query.price = { $gt: minPrice, $lt: maxPrice };
    }
    if (minPrice && maxPrice && price) {
      query.$and = [
        { price: +price },
        { price: { $gt: +minPrice, $lt: +maxPrice } },
      ];
    }
    if (description) {
      query.description = { $regex: new RegExp(description, "i") };
    }
    if (category) {
      query.category = { $regex: new RegExp(category, "i") };
    }
    if (image) {
      query.image = image;
    }
    if (quantity) {
      query.quantity = quantity;
    }

    if (rating) {
      let jsonRating;
      jsonRating = JSON.parse(rating);
      Product.find(
        {
          query,
          "rating.rate": jsonRating.rate,
          "rating.count": jsonRating.count,
        },
        (err, products) => {
          if (!isEmpty(err)) console.log("err", err);
          if (!isEmpty(query)) console.log("query2", query);

          res.send(products);
        }
      );
    } else {
      Product.find({ query }, (err, products) => {
        if (!isEmpty(err)) console.log("err", err);
        if (!isEmpty(query)) console.log("query1", query);
        // console.log(products);
        res.send(products);
      });
    }
  });

  app.get("/api/products/:id", (req, res) => {
    const { id } = req.params;
    Product.findById(id, (err, product) => {
      res.send(product);
    });
  });

  app.post("/api/products", (req, res) => {
    const { title, price, description, category, image, rating, quantity } =
      req.body;
    const product = new Product({
      title,
      price,
      description,
      category,
      image,
      rating,
      quantity,
    });
    product.save((err, product) => {
      // console.log("err", err, "product", product);
      res.send(product);
    });
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const { title, price, description, category, image, rating, quantity } =
      req.body;
    Product.findByIdAndUpdate(
      id,
      { title, price, description, category, image, rating, quantity },
      { new: true },
      (err, product) => {
        res.send(product);
      }
    );
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    Product.findByIdAndDelete(id, (err, product) => {
      if (!isEmpty(err)) console.log("err", err);
      else console.log(`product with id:${id} -deleted`);
      InitProducts();
      res.send(product);
    });
  });

  // The "catchall" handler: For any request that doesn't
  // match one above, send back React's index.html file.
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/client/build/index.html");
  });

  const InitProducts = () => {
    Product.findOne((err, product) => {
      console.log("Product.findOne((err, product)", product !== null);
      if (!product) {
        fetch("https://fakestoreapi.com/products")
          .then((response) => response.json())
          .then((products) => {
            let newProducts = [...products];
            for (let index = 0; index < newProducts.length; index++) {
              newProducts[index] = { ...products[index], quantity: 0 };
            }
            console.log(`fetch("https://fakestoreapi.com/products")`);

            // const products = JSON.parse(data);
            Product.insertMany(newProducts, (err, productRes) => {
              // res.send(productRes);
              console.log(`Product.insertMany(newProducts, (err, productRes)`);
            });
          })
          .catch((error) => {
            console.log("fetch error", error);
          });
      }
    });
  };
  const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
  const mongo_url =
    `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority` ||
    "mongodb://localhost:27017/my_shop";
  // const mongo_url =
  //   process.env.MONGO_URL || "mongodb://localhost:27017/my_shop";
  const port = process.env.PORT || 5000;
  mongoose.connect(
    mongo_url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      app.listen(port, () => {
        InitProducts();
        console.log(`app listening on ${port}`);
      });
    }
  );
} catch (error) {
  console.log("ERROR! ");
  console.log(error);
}
