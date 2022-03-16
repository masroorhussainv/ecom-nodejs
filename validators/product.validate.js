const Joi = require("joi")

module.exports = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string(),
  sku: Joi.string(),
})
