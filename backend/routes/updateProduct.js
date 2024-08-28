const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");

exports.updateProduct = async (req, res) => {
  let prd = req.body.product;
  const productPath = path.join(__dirname, `../uploads/products/${prd._id}`);
  if (!fs.existsSync(productPath)) {
    fs.mkdirSync(productPath, { recursive: true });
  }
  let index = fs.readdirSync(productPath).length;
  if (index >= 4 && prd.images.length !== index)
    return res.status(400).send({ error: "Maximum images reached" });
  console.log("LENGTHS ===========> ", index, prd.images.length);
  if (index === prd.images.length - 1) {
    let imgExt = prd.images[index].match(
      /^data:image\/(png|jpg|jpeg);base64,/
    )[1];
    let imgPath = path.join(productPath, `${prd._id}_${index}.${imgExt}`);
    fs.writeFileSync(
      imgPath,
      prd.images[index].replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    prd.images[
      index
    ] = `http://localhost:3000/uploads/products/${prd._id}/${prd._id}_${index}.${imgExt}`;
  }

  prd.category.image = `http://localhost:3000/uploads/categories/${prd.category.name}/${prd.category.name}.jpg`;

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
