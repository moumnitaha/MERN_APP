const Order = require("./order.model");
const Product = require("../products/product.model");
const User = require("../users/user.model");

async function addOrder(orderData, userId) {
  const { products, total, customer } = orderData;
  const customerId = customer || userId;
  for (let product of products) {
    const productData = await Product.findById(product.product);
    if (!productData) {
      throw new Error(`Product with id ${product.product} not found`);
    }
    if (productData.quantity < product.quantity) {
      throw new Error(`Product: \"${productData.title}\" out of stock!`);
    }
    productData.quantity -= product.quantity;
    productData.orders += 1;
    await productData.save();
  }
  const order = new Order({
    customer: customerId,
    products,
    total,
  });
  await order.save();
  return { message: "Order created successfully" };
}

async function getOrders() {
  let orders = await Order.find({});
  if (!orders.length) {
    return [];
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
  return newOrders;
}

async function deleteOrder(orderId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  await Order.findByIdAndDelete(orderId);
  return { message: "Order deleted successfully" };
}

module.exports = { addOrder, getOrders, deleteOrder };
