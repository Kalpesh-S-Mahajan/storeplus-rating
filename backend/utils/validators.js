const Joi = require("joi");

const passwordPattern =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,16}$/;

module.exports = {
  signup: Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).allow("", null),
    password: Joi.string().pattern(passwordPattern).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
