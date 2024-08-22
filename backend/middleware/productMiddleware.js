const Joi = require("joi");

const productValidator = (req, res, next) => {
  const addProductSchema = Joi.object({
    _id: Joi.string().length(24).hex(),
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(4).max(100).required(),
    price: Joi.number().min(1).required(),
    images: Joi.array().items(Joi.string()),
    category: Joi.object({
      name: Joi.string()
        .valid("Clothes", "Electronics", "Furniture", "Shoes", "Miscellaneous")
        .required(),
      id: Joi.number(),
      image: Joi.string(),
      //   createdAt: Joi.date(),
      //   updatedAt: Joi.date(),
    }).required(),
  });
  const { error } = addProductSchema.validate(req.body.product);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};

module.exports = { productValidator };
