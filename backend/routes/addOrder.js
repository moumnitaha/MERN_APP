const Order = require("../models/Order");

exports.addOrder = async (req, res) => {
  try {
    const { products, total } = req.body;
    const order = new Order({
      user: req.user.userId,
      products,
      total,
    });
    await order.save();
    res.status(201).send({ message: "Order created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};
