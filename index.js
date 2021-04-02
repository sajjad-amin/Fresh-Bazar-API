require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

client.connect((err) => {
  const productCollection = client.db("fresh-valley").collection("products");
  const orderCollection = client.db("fresh-valley").collection("orders");

  app.get("/", (req, res)=>{
      res.send("Welcome to FRESH BAZAR API")
  })

  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, data) => {
      res.json(data);
    });
  });

  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, data) => {
        res.json(data);
      });
  });

  app.get("/orders", (req, res) => {
    orderCollection.find({ email: req.headers.email }).toArray((err, data) => {
      res.json(data);
    });
  });

  app.post("/addProduct", (req, res) => {
    productCollection.insertOne(req.body).then((result) => {
      res.json(result);
    });
  });

  app.post("/addOrder", (req, res) => {
    orderCollection.insertOne(req.body).then((result) => {
      res.json(result);
    });
  });

  app.delete("/removeProduct/:id", (req, res) => {
    productCollection
      .deleteOne({
        _id: ObjectId(req.params.id),
      })
      .then((result) => {
        res.json(result);
      });
  });
});

app.listen(process.env.PORT || 2000);
