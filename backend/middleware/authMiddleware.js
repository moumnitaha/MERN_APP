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
    return res.status(400).send(error.details[0].message);
  }
  next();
};

const loginValidator = (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(30).required(),
  });
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

const updateInfosValidator = (req, res, next) => {
  const updateInfoSchema = Joi.object({
    firstName: Joi.string()
      .regex(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
      .min(3)
      .max(30)
      .required(),
    lastName: Joi.string().min(3).max(30).required(),
    // email: Joi.string().email().required(),
    // password: Joi.string().min(4).max(30),
  });
  const { error } = updateInfoSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

const changePassValidator = (req, res, next) => {
  console.log(req.body);
  const changePassSchema = Joi.object({
    oldPassword: Joi.string().min(4).max(30).required(),
    newPassword: Joi.string().min(4).max(30).required(),
  });
  const { error } = changePassSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

module.exports = {
  signupValidator,
  loginValidator,
  updateInfosValidator,
  changePassValidator,
};
