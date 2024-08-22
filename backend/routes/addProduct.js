const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  try {
    let prd = req.body.product;
    if (prd._id) {
      delete prd._id;
    }
    const product = new Product(prd);
    await product.save();
    res.send({ message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error adding product" });
  }
};
