const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const { BadRequestError } = require("../errors");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Product = require("../models/product");
const user = require("../models/user");

const createProduct = asyncWrapper(async (req, res, next) => {
  const { title, price, url, description, purchased } = req.body;
  const createdBy = req.user.userId;

  let body = { title, price, url, description, purchased, createdBy };

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      folder: `doineedit/${createdBy}`,
    });
    body = {
      ...body,
      image: result.secure_url,
      imageId: result.public_id,
    };
  }

  const newProduct = await Product.create(body);
  res.status(StatusCodes.CREATED).json({ success: true, data: newProduct });
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
  const { title, price, url, description, purchased } = req.body;
  if (!title || !price) {
    return next(
      new BadRequestError(
        "Required fields must be provided",
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const product = await Product.findOne({ _id: id, createdBy });

  if (!product) {
    next(new BadRequestError("Product not found", StatusCodes.BAD_REQUEST));
  }

  let body = { title, price, url, description, purchased };
  if (req.file) {
    if (product.imageId) {
      await cloudinary.uploader.destroy(product.imageId);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      folder: `doineedit/${createdBy}`,
    });
    body = {
      ...body,
      image: result.secure_url,
      imageId: result.public_id,
    };
  }

  const newProduct = await Product.findOneAndUpdate(
    { _id: id, createdBy },
    body,
    { new: true, runValidators: true, omitUndefined: true }
  );
  res.status(StatusCodes.OK).json({ success: true, data: newProduct });
});

const removeProduct = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const createdBy = req.user.userId;
  const product = await Product.findOneAndDelete({ _id: id, createdBy });
  await cloudinary.uploader.destroy(product.imageId);
  if (!product) {
    next(new BadRequestError("Product not found", StatusCodes.BAD_REQUEST));
  } else {
    res.status(StatusCodes.OK).json({ success: true, data: product });
  }
});

const markProductPurchased = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { purchased } = req.body;

  const createdBy = req.user.userId;
  const product = await Product.findOneAndUpdate(
    { _id: id, createdBy },
    { purchased },
    { new: true, runValidators: true }
  );
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
  markProductPurchased,
};
