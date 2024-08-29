const Joi = require("joi");

const productValidator = (req, res, next) => {
  const addProductSchema = Joi.object({
    _id: Joi.string().length(24).hex(),
    title: Joi.string().min(3).max(40).required(),
    description: Joi.string().min(100).max(500).required(),
    price: Joi.number().min(1).max(100_000).required(),
    images: Joi.array().items(Joi.string().allow("")),
    category: Joi.object({
      name: Joi.string()
        .valid("Clothes", "Electronics", "Furniture", "Shoes", "Miscellaneous")
        .required(),
      id: Joi.number(),
      image: Joi.string(),
      //   createdAt: Joi.date(),
      //   updatedAt: Joi.date(),
    }).required(),
    quantity: Joi.number().min(1).max(1_000).required(),
    rates: Joi.number().min(0).max(5).required(),
  });
  const { error } = addProductSchema.validate(req.body.product);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};

module.exports = { productValidator };
