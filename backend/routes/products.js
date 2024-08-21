const Product = require("../models/Product");
exports.products = async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    console.log(error);
  }
};
