const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
  markProductPurchased,
} = require("../controllers/productController");

const router = express.Router();

router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(removeProduct);
router.route("/:id/purchased").put(markProductPurchased);

module.exports = router;
