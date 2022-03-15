const bcrypt = require("bcryptjs")

module.exports = (plainPass, hashPass) =>
  bcrypt
    .compare(plainPass, hashPass)
    .then((isPasswordMatch) => isPasswordMatch)
    .catch((err) => false)
