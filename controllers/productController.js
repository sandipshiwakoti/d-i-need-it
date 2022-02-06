const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const { BadRequestError } = require("../errors");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Product = require("../models/product");

const createProduct = asyncWrapper(async (req, res, next) => {
  const { title, price, url, purchased } = req.body;
  const createdBy = req.user.userId;
  const product = await Product.create({
    title,
    price,
    url,
    purchased,
    createdBy,
  });
  res.status(StatusCodes.CREATED).json({ success: true, data: product });
});

const getProducts = asyncWrapper(async (req, res, next) => {
  const createdBy = req.user.userId;
  const products = await Product.find({ createdBy });
  res.status(StatusCodes.OK).json({ success: true, data: products });
});

const getProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const createdBy = req.user.userId;
  const product = await Product.findOne({ _id: id, createdBy });
  if (product) {
    res.status(StatusCodes.OK).json({ success: true, data: product });
  } else {
    next(new BadRequestError("Product not found", StatusCodes.BAD_REQUEST));
  }
});

const updateProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const createdBy = req.user.userId;
  const { title, price, url, purchased } = req.body;
  console.log(title, price, url, purchased);
  if (!title || !price) {
    return next(
      new BadRequestError(
        "Required fields must be provided",
        StatusCodes.BAD_REQUEST
      )
    );
  }
  const product = await Product.findOneAndUpdate(
    { _id: id, createdBy },
    { title, price, url, purchased },
    { new: true, runValidators: true, omitUndefined: true }
  );
  if (!product) {
    next(new BadRequestError("Product not found", StatusCodes.BAD_REQUEST));
  } else {
    res.status(StatusCodes.OK).json({ success: true, data: product });
  }
});

const removeProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const createdBy = req.user.userId;
  const product = await Product.findOneAndDelete({ _id: id, createdBy });
  if (!product) {
    next(new BadRequestError("Product not found", StatusCodes.BAD_REQUEST));
  } else {
    res.status(StatusCodes.OK).json({ success: true, data: product });
  }
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  removeProduct,
};
