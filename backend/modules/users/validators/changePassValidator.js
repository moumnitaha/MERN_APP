const Joi = require("joi");

const changePassValidator = (req, res, next) => {
  const changePassSchema = Joi.object({
    oldPassword: Joi.string().min(4).max(30).required(),
    newPassword: Joi.string().min(4).max(30).required(),
  });
  const { error } = changePassSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};

module.exports = changePassValidator;
