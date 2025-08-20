const express = require("express");
const router = express.Router();
const productsController = require("./product.controller");
const uploadProductImages = require("./middlewares/uploadProductImagesMiddleware");

router.get("/", productsController.getProducts);
router.post(
  "/",
  uploadProductImages.array("images", 4),
  productsController.addProduct
);
router.put("/", productsController.updateProduct);
router.delete("/", productsController.deleteProduct);

module.exports = router;
