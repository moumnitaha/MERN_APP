const Joi = require("joi");

const signupValidator = (req, res, next) => {
  const signupSchema = Joi.object({
    firstName: Joi.string()
      .regex(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
      .min(3)
      .max(30)
      .required(),
    lastName: Joi.string()
      .regex(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
      .min(3)
      .max(30)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(30).required(),
  });
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};

module.exports = signupValidator;
