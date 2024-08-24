const Product = require("../models/Product");
const products = async (req, res) => {
  console.log("products Method => ", req.method);
  console.log("products Query => ", req.query);
  try {
    let mainQuery = {};
    let { limit, search, min, max, category, page, sort = 1, id } = req.query;
    if (id) {
      if (id.length !== 24) {
        return res.status(400).send({ error: "Invalid product id" });
      }
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).send({ error: "Product not found" });
      }
      return res.send(product);
    }
    if (
      parseInt(min) < 0 ||
      parseInt(max) < 0 ||
      parseInt(min) > parseInt(max) ||
      (min && isNaN(min)) ||
      (max && isNaN(max))
    ) {
      return res.status(400).send({
        error:
          "Invalid price range, min should be less than max, and both should be positive numbers",
      });
    }
    if (page < 1 || (page && isNaN(page))) {
      return res
        .status(400)
        .send({ error: "Invalid page number, should be a positive number" });
    }
    if (limit < 1 || (limit && isNaN(limit))) {
      return res
        .status(400)
        .send({ error: "Invalid limit number, should be a positive number" });
    }
    if (parseInt(sort) !== 1 && parseInt(sort) !== -1) {
      return res
        .status(400)
        .send({ error: "Invalid sort value, should be 1 or -1" });
    }
    if (search) {
      //check if search has invalid characters
      const invalidCharsPattern = /[$\\\[\]{}|;:'"<>`]/;
      if (invalidCharsPattern.test(search)) {
        console.log("Invalid search query");
        return res.status(400).send({ error: "Invalid search query" });
      }
      if (search.includes(",")) search = search.split(",").filter(Boolean);
      if (typeof search === "string") {
        mainQuery.$or = [
          {
            title: { $regex: search, $options: "i" },
          },
          {
            description: { $regex: search, $options: "i" },
          },
        ];
      } else {
        mainQuery.$or = [
          {
            title: { $in: search.map((search) => new RegExp(search, "i")) },
          },
          {
            description: {
              $in: search.map((search) => new RegExp(search, "i")),
            },
          },
        ];
      }
    }
    if (min) mainQuery.price = { $gte: parseInt(min) };
    if (max) mainQuery.price = { $lte: parseInt(max) };
    if (category) {
      const invalidCharsPattern = /[$\\\[\]{}|;:'"<>`]/;
      if (invalidCharsPattern.test(category)) {
        console.log("Invalid search query");
        return res.status(400).send({ error: "Invalid category query" });
      }
      if (category.includes(","))
        category = category.split(",").filter(Boolean);

      if (typeof category === "string") {
        mainQuery["category.name"] = { $regex: category, $options: "i" };
      } else {
        mainQuery["category.name"] = {
          $in: category.map((category) => new RegExp(category, "i")),
        };
      }
    }
    console.log("Final Query => ", mainQuery);
    const skip = (page - 1) * limit;
    const products = await Product.find(mainQuery)
      .sort({ price: parseInt(sort) })
      .limit(limit)
      .skip(skip)
      .select({
        _id: 1,
        title: 1,
        description: 1,
        price: 1,
        images: 1,
        category: 1,
        createdAt: 1,
        updatedAt: 1,
      });
    res.send(products);
  } catch (error) {
    console.log(error);
  }
};

module.exports = products;
