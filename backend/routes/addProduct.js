const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

exports.addProduct = async (req, res) => {
  try {
    let prd = req.body.product;
    if (prd._id) {
      delete prd._id;
    }
    prd.images = prd.images.filter((img) => img);
    const product = new Product(prd);
    const productPath = path.join(
      __dirname,
      `../uploads/products/${product._id}`
    );
    if (!fs.existsSync(productPath)) {
      fs.mkdirSync(productPath, { recursive: true });
    }
    for (let i = 0; i < prd.images.length; i++) {
      let imgExt = prd.images[i].match(
        /^data:image\/(png|jpg|jpeg);base64,/
      )[1];
      let imgPath = path.join(productPath, `${product._id}_${i}.${imgExt}`);
      fs.writeFileSync(
        imgPath,
        prd.images[i].replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );
      product.category.image = `http://localhost:3000/uploads/categories/${prd.category.name}/${prd.category.name}.jpg`;
      product.images[
        i
      ] = `http://localhost:3000/uploads/products/${product._id}/${product._id}_${i}.${imgExt}`;
    }
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
