const productService = require("./product.service");

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.query);
    res.send(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    // req.body fields are plain text, req.files is an array of uploaded files
    const productData = JSON.parse(req.body.product);
    const result = await productService.addProduct(productData, req.files);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const result = await productService.updateProduct(req.body.product);
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(
      req.body.product,
      req.body.image
    );
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
