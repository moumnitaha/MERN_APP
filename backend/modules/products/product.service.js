const Product = require("./product.model");
const fs = require("fs");
const path = require("path");

async function getProducts(query) {
  let mainQuery = {};
  let { limit, search, min, max, category, page = 1, sort, id } = query;

  if (id) {
    if (id.length !== 24) {
      throw new Error("Invalid product id");
    }
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
  if (
    (min && parseInt(min) < 0) ||
    (max && parseInt(max) < 0) ||
    (min && max && parseInt(min) > parseInt(max)) ||
    (min && isNaN(min)) ||
    (max && isNaN(max))
  ) {
    throw new Error(
      "Invalid price range, min should be less than max, and both should be positive numbers"
    );
  }
  if (page < 1 || isNaN(page)) {
    throw new Error("Invalid page number, should be a positive number");
  }
  if (limit < 1 || (limit && isNaN(limit))) {
    throw new Error("Invalid limit number, should be a positive number");
  }
  if (sort && parseInt(sort) !== 1 && parseInt(sort) !== -1) {
    throw new Error("Invalid sort value, should be 1 or -1");
  }
  if (search) {
    const invalidCharsPattern = /[$\\\[\]{}|;:'"<>`]/;
    if (invalidCharsPattern.test(search)) {
      throw new Error("Invalid search query");
    }
    if (search.includes(",")) search = search.split(",").filter(Boolean);
    if (typeof search === "string") {
      mainQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    } else {
      mainQuery.$or = [
        { title: { $in: search.map((s) => new RegExp(s, "i")) } },
        { description: { $in: search.map((s) => new RegExp(s, "i")) } },
      ];
    }
  }
  if (min) mainQuery.price = { ...mainQuery.price, $gte: parseInt(min) };
  if (max) mainQuery.price = { ...mainQuery.price, $lte: parseInt(max) };
  if (category) {
    mainQuery["category.name"] = category;
  }
  const skip = (page - 1) * limit;
  let products = await Product.find(mainQuery)
    .sort({ createdAt: sort ? parseInt(sort) : -1 })
    .skip(skip)
    .limit(limit);
  return products;
}

async function addProduct(product) {
  if (product._id) delete product._id;

  product.images = (product.images || []).filter((img) => img);
  const newProduct = new Product(product);

  const productPath = path.join(
    __dirname,
    `../../uploads/products/${newProduct._id}`
  );
  if (!fs.existsSync(productPath)) {
    fs.mkdirSync(productPath, { recursive: true });
  }

  if (product.category && product.category.name) {
    newProduct.category.image = `/uploads/categories/${product.category.name}/${product.category.name}.jpg`;
  }
  for (let i = 0; i < product.images.length; i++) {
    const match = product.images[i].match(
      /^data:image\/(png|jpg|jpeg);base64,/
    );
    if (!match) continue;
    let imgExt = match[1];
    let imgPath = path.join(productPath, `${newProduct._id}_${i}.${imgExt}`);
    fs.writeFileSync(
      imgPath,
      product.images[i].replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    newProduct.images[
      i
    ] = `/uploads/products/${newProduct._id}/${newProduct._id}_${i}.${imgExt}`;
  }
  await newProduct.save();
  return { message: "Product added successfully", id: newProduct._id };
}

async function updateProduct(prd) {
  if (!prd._id) throw new Error("Product ID is required");
  const productPath = path.join(__dirname, `../../uploads/products/${prd._id}`);
  if (!fs.existsSync(productPath)) {
    fs.mkdirSync(productPath, { recursive: true });
  }
  let index = fs.readdirSync(productPath).length;
  if (index >= 4 && prd.images.length !== index) {
    throw new Error("Maximum images reached");
  }
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
    ] = `/uploads/products/${prd._id}/${prd._id}_${index}.${imgExt}`;
  }
  if (prd.category && prd.category.name) {
    prd.category.image = `/uploads/categories/${prd.category.name}/${prd.category.name}.jpg`;
  }
  const updated = await Product.updateOne({ _id: prd._id }, { $set: prd });
  if (updated.n === 0 && updated.modifiedCount === 0) {
    throw new Error("Product not found");
  }
  const product = await Product.findOne({ _id: prd._id });
  return { message: "Product updated successfully", product };
}

async function deleteProduct(product, image) {
  if (!product._id) throw new Error("Product ID is required");
  let productId = product._id;

  if (image !== null && image !== undefined) {
    console.log("==> ", image);
    const productPath = path.join(
      __dirname,
      `../../uploads/products/${productId}`
    );
    console.log(productPath, productId);
    if (fs.existsSync(productPath)) {
      let imgIndex = image;
      let files = fs.readdirSync(productPath);
      let img = files[imgIndex];
      if (img) {
        console.log(img);
        let imgPath = path.join(productPath, img);
        try {
          fs.unlinkSync(imgPath);
          const productDoc = await Product.findOne({ _id: productId });
          productDoc.images.splice(imgIndex, 1);
          files = fs.readdirSync(productPath);
          files.forEach((file, index) => {
            let fileExt = file.match(/^.*\.(png|jpg|jpeg)$/)[1];
            fs.renameSync(
              path.join(productPath, file),
              path.join(productPath, `${productId}_${index}.${fileExt}`)
            );
          });
          files = fs.readdirSync(productPath);
          files.forEach((file, index) => {
            let fileExt = file.match(/^.*\.(png|jpg|jpeg)$/)[1];
            productDoc.images[
              index
            ] = `/uploads/products/${productId}/${productId}_${index}.${fileExt}`;
          });
          await productDoc.save();
          return { message: "Image deleted successfully" };
        } catch (error) {
          throw new Error("Error deleting image");
        }
      }

      return { message: "Image deleted successfully" };
    } else {
      return { message: "Image deleted successfully" };
    }
  }

  const deleted = await Product.deleteOne({ _id: productId });
  if (deleted.deletedCount === 0) {
    throw new Error("Product not found");
  }
  const productPath = path.join(
    __dirname,
    `../../uploads/products/${productId}`
  );
  if (fs.existsSync(productPath)) {
    fs.rmSync(productPath, { recursive: true, force: true });
  }
  return { message: "Product deleted successfully" };
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
