const { User } = require("../models")
const encryptPassword = require("../utils/encryptPassword.util")
const comparePassword = require("../utils/comparePassword.util")
const jwt = require("jsonwebtoken")

module.exports = {
  signUp: async (req, res) => {
    let { username, email, password, profilePicture } = req.body

    // Validate user input
    if (!(email && password && username)) {
      return res.status(400).send({
        error: `${
          username ? (email ? "password" : "email") : "username"
        } is required`,
      })
    }

    email = email.toLowerCase()
    // Check user existence
    const matchedUser = await User.findOne({ where: { email } })
    if (matchedUser !== null) {
      return res
        .status(409)
        .send({ error: `User already existed with this email` })
    }

    //Encrypt password
    const encryptedPassword = await encryptPassword(password)
    if (encryptedPassword.err) {
      return res.status(500).send({ error: `Unable to encrypt user password` })
    }
    password = encryptedPassword.hash

    // Create user
    User.create({
      username,
      email,
      password,
      profile_picture: profilePicture,
    })
      .then((user) => {
        // Create token
        const token = jwt.sign(
          { userID: user.id, email: user.email, username: user.username },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        )

        delete user.dataValues.password
        return res.status(201).send({ token, user })
      })
      .catch((err) =>
        res.status(422).send({ error: "failed to create user", message: err })
      )
  },

  login: async (req, res) => {
    let { email, password } = req.body

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send({
        error: `${email ? "password" : "email"} is required`,
      })
    }

    email = email.toLowerCase()
    // Check user existence
    const user = await User.findOne({ where: { email } })
    if (user === null) {
      return res.status(404).send({ error: `User not found with this email` })
    }

    //compare password
    const result = await comparePassword(password, user.password)
    if (!result) {
      return res.status(403).send({ error: `Incorrect password` })
    }

    // Create token
    const token = jwt.sign(
      { userID: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    )

    delete user.dataValues.password
    return res.status(201).send({ token, user })
  },
}
