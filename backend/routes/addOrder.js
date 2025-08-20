const Order = require("../modelsdd/Order");
const Product = require("../modelsdd/Product");

exports.addOrder = async (req, res) => {
  try {
    const { products, total, customer } = req.body;
    console.log("products", products);
    console.log("total", total);
    console.log("user", customer, req.user.userId);
    for (let product of products) {
      const productData = await Product.findById(product.product);
      if (productData.quantity < product.quantity) {
        return res.status(400).send({
          message: `Product: "${productData.title}" out of stock!`,
        });
      }
      productData.quantity -= product.quantity;
      productData.orders += 1;
      await productData.save();
    }
    const order = new Order({
      customer,
      products,
      total,
    });
    await order.save();
    res.status(201).send({ message: "Order created successfully" });
  } catch (error) {
    console.log("error => ", error);
    res.status(500).send({ message: "Server error", error: error.message });
  }
};
