const Product = require("../models/Product");
exports.products = async (req, res) => {
  console.log("products Query => ", req.query);
  try {
    let mainQuery = {};
    const { limit, search, min, max, category, page, sort = 1 } = req.query;
    if (
      parseInt(min) < 0 ||
      parseInt(max) < 0 ||
      parseInt(min) > parseInt(max)
    ) {
      return res.status(400).send({ error: "Invalid price range" });
    }
    if (page < 1) {
      return res.status(400).send({ error: "Invalid page number" });
    }
    if (limit < 1) {
      return res.status(400).send({ error: "Invalid limit" });
    }
    if (parseInt(sort) !== 1 && parseInt(sort) !== -1) {
      return res.status(400).send({ error: "Invalid sort value" });
    }
    if (search) {
      mainQuery.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
        {
          description: { $regex: search, $options: "i" },
        },
      ];
    }
    if (min || max) {
      mainQuery.price = {};
      if (min) mainQuery.price.$gte = parseInt(min);
      if (max) mainQuery.price.$lte = parseInt(max);
    }
    if (category) {
      mainQuery["category.name"] = { $regex: category, $options: "i" };
    }
    console.log("Final Query => ", mainQuery);
    const skip = (page - 1) * limit;
    const products = await Product.find(mainQuery)
      .sort({ price: parseInt(sort) })
      .limit(limit)
      .skip(skip);
    const newProducts = products.map((product) => {
      return {
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category,
        createAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });
    res.send(newProducts);
  } catch (error) {
    console.log(error);
  }
};
