const express = require("express");
const router = express.Router();
const productsController = require("./product.controller");

router.get("/", productsController.getProducts);
router.post("/", productsController.addProduct);
router.put("/", productsController.updateProduct);
router.delete("/", productsController.deleteProduct);

module.exports = router;
