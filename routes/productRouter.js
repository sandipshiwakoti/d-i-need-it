const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
  markProductPurchased,
  updateLocation,
} = require("../controllers/productController");

const router = express.Router();
const upload = require("../uploadUtils/cloudUpload");

router.route("/").get(getProducts);
router.route("/:id").get(getProduct).delete(removeProduct);
router.route("/:id/purchased").put(markProductPurchased);
router.route("/:id/location").put(updateLocation);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
module.exports = router;
