const orderService = require("./order.service");

exports.addOrder = async (req, res) => {
  try {
    const result = await orderService.addOrder(req.body, req.user?.userId);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const result = await orderService.getOrders();
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.body.id);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
