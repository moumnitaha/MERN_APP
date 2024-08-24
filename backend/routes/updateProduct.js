const Product = require("../models/Product");

exports.updateProduct = async (req, res) => {
  let prd = req.body.product;
  try {
    const updated = await Product.updateOne({ _id: prd._id }, { $set: prd });
    if (updated.n === 0) {
      return res.status(404).send({ error: "Product not found" });
    }
    const product = await Product.findOne({ _id: prd._id });
    res.send({ message: "Product updated successfully", product });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error updating product" });
  }
};
