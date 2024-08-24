const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  try {
    let prd = req.body.product;
    if (prd._id) {
      delete prd._id;
    }
    const product = new Product(prd);
    await product.save();
    res.send({ message: "Product added successfully", id: product._id });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).send({ error: "Product already exists" });
    }
    res.status(400).send({ error: error.message });
  }
};
