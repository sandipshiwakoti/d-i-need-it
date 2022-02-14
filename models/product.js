const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  purchased: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  imageId: {
    type: String,
  },
  location: {
    type: String,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
