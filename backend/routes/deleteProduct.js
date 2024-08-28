const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

exports.deleteProduct = async (req, res) => {
  if (!req.body.product) {
    return res.status(400).send({ error: "Product data is required" });
  }
  let prd = req.body.product;
  let imgIndex = req.body.image;
  if (imgIndex !== null) {
    console.log("Image to delete => ", imgIndex);
    let productPath = path.join(__dirname, `../uploads/products/${prd._id}`);
    if (fs.existsSync(productPath)) {
      let img = fs.readdirSync(productPath)[imgIndex];
      console.log(img);
      let imgPath = path.join(productPath, img);
      try {
        fs.unlinkSync(imgPath);
        console.log("Image deleted successfully");
        const product = await Product.findOne({ _id: prd._id });
        product.images.splice(imgIndex, 1);
        let files = fs.readdirSync(productPath);
        files.forEach((file, index) => {
          let fileExt = file.match(/^.*\.(png|jpg|jpeg)$/)[1];
          fs.renameSync(
            path.join(productPath, file),
            path.join(productPath, `${prd._id}_${index}.${fileExt}`)
          );
        });
        files = fs.readdirSync(productPath);
        files.forEach((file, index) => {
          let fileExt = file.match(/^.*\.(png|jpg|jpeg)$/)[1];
          product.images[
            index
          ] = `http://localhost:3000/uploads/products/${prd._id}/${prd._id}_${index}.${fileExt}`;
        });
        await product.save();
        return res.status(200).json({ message: "Image deleted successfully" });
      } catch (error) {
        // console.log(error);
        return res.status(400).send({ error: "Error deleting image" });
      }
    } else {
      console.log("Image not found");
    }
    return;
  }
  try {
    if (!prd._id) {
      return res.status(400).send({ error: "Product ID is required" });
    }
    const deleted = await Product.deleteOne({ _id: prd._id });
    if (deleted.deletedCount === 0) {
      return res.status(404).send({ error: "Product not found" });
    }
    const productPath = path.join(__dirname, `../uploads/products/${prd._id}`);
    if (fs.existsSync(productPath))
      fs.rmdirSync(productPath, { recursive: true });
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error deleting product" });
  }
};
