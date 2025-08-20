const Order = require("../modelsdd/Order");
const Product = require("../modelsdd/Product");
const User = require("../modules/users/user.model");

exports.getOrders = async (req, res) => {
  try {
    let orders = await Order.find({});
    if (!orders.length) {
      return res.status(404).send({ message: "No orders found" });
    }
    let newOrders = await Promise.all(
      orders.map(async (order) => {
        let products = await Promise.all(
          order.products.map(async (product) => {
            let productDetails = await Product.findById(product.product);
            if (!productDetails) {
              return {
                _id: "Product_not_found",
                title: "Product_not_found",
                images: ["https://via.placeholder.com/300"],
                price: -1,
                quantity: -1,
              };
            }
            return {
              _id: productDetails._id,
              title: productDetails.title,
              images: productDetails.images,
              price: productDetails.price,
              quantity: product.quantity,
            };
          })
        );
        let user = await User.findById(order.customer);
        return {
          _id: order._id,
          products: products,
          total: products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ),
          quantity: products.reduce((acc, item) => acc + item.quantity, 0),
          status: order.status,
          user: user ? user.firstName + " " + user.lastName : "unknown",
          createdAt: order.createdAt,
        };
      })
    );
    return res.status(200).send(newOrders);
  } catch (error) {
    console.log("Error fetching orders: ", error.message);
    return res
      .status(500)
      .send({ message: "Server error", error: error.message });
  }
};
