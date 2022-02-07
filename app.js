const express = require("express");
require("dotenv").config();

const connectDB = require("./db/connect");
const errorHandler = require("./middlewares/errorHandler");
const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouter");
const notFound = require("./middlewares/notFound");
const auth = require("./middlewares/auth");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", auth, productRouter);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const mongodbURI = process.env.MONGODB_URI;
const localdbURI = "mongodb://localhost:27017/doineedit";

const start = async () => {
  try {
    await connectDB(mongodbURI);
    console.log("Connected!!");
    app.listen(port, () => {
      console.log(`Listening at port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
