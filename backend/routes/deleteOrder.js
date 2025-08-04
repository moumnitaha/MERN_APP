const Order = require("../models/Order");

exports.deleteOrder = async (req, res) => {
  const orderId = req.body.id;
  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }
  try {
    const deleted = await Order.deleteOne({ _id: orderId });
    if (deleted.deletedCount === 0) {
      res.status(404).json({ message: "Order not found" });
    } else {
      res.status(200).json({ message: "Order deleted successfully" });
    }
  } catch (error) {
    console.log("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order", error });
  }
};
