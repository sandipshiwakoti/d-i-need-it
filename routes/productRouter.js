const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
} = require("../controllers/productController");

const router = express.Router();

router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(removeProduct);

module.exports = router;
