const express = require("express");
const router = express.Router();
const ordersController = require("./order.controller");

router.get("/", ordersController.getOrders);
router.post("/", ordersController.addOrder);
router.delete("/", ordersController.deleteOrder);

module.exports = router;
