const Product = require("../models/Product");

exports.deleteProduct = async (req, res) => {
  let prd = req.body.product;
  try {
    if (!prd._id) {
      return res.status(400).send({ error: "Product ID is required" });
    }
    const deleted = await Product.deleteOne({ _id: prd._id });
    if (deleted.deletedCount === 0) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error deleting product" });
  }
};
