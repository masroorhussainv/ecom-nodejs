const bcrypt = require("bcryptjs")

module.exports = (password) =>
  bcrypt
    .genSalt(10)
    .then((salt) =>
      bcrypt
        .hash(password, salt)
        .then((hash) => {
          return { hash }
        })
        .catch((err) => {
          return { err }
        })
    )
    .catch((err) => {
      return { err }
    })
