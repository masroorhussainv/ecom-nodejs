const Joi = require("joi")

module.exports = Joi.object({
  number: Joi.string().length(16).required(),
  expMonth: Joi.string().max(2).required(),
  expYear: Joi.string().max(4).required(),
  cvc: Joi.string().length(3).required(),
})
