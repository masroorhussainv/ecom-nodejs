const Joi = require("joi")

module.exports = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(5).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  profilePicture: Joi.string(),
  reset_token: Joi.string(),
})
