const { User } = require("../models")
const encryptPassword = require("../utils/encryptPassword.util")
const comparePassword = require("../utils/comparePassword.util")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail.util")

const resetPasswordTemplate = (name, link) => `<html>
    <head>
        <style>
        </style>
    </head>
    <body>
        <p>Hi ${name},</p>
        <p>You requested to reset your password.</p>
        <p> Please, click the link below to reset your password</p>
        <a href="${link}">Reset Password</a>
    </body>
</html>`

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
    return res.status(200).send({ token, user })
  },

  forgotPassword: async (req, res) => {
    let { email } = req.body

    // Validate user email
    if (!email) {
      return res.status(400).send({
        error: `email is required`,
      })
    }

    email = email.toLowerCase()
    // Check user existence
    const user = await User.findOne({ where: { email } })
    if (user === null) {
      return res.status(404).send({ error: `User not found with this email` })
    }

    // Genrate reset token
    const token = user.reset_token
      ? user.reset_token
      : crypto.randomBytes(48).toString("hex")
    if (!user.reset_token) {
      await User.update({ reset_token: token }, { where: { email } })
    }

    // Send email
    const link = `${process.env.CLIENT_URL}/password/reset?uid=${user.id}&token=${token}`
    const linkSent = await sendEmail(
      user.email,
      "Reset password link",
      resetPasswordTemplate(user.username, link)
    )
    if (!linkSent) {
      return res.status(503).send({ error: `Email service is not working` })
    }

    res
      .status(200)
      .send({ success: "password reset link sent to your email account" })
  },

  resetPassword: async (req, res) => {
    let { uid, token, newPassword } = req.body

    // Validate user
    if (!(uid && token && newPassword)) {
      return res.status(400).send({
        error: `${
          uid ? (token ? "new password" : "token") : "user id"
        } is required`,
      })
    }

    const user = await User.findOne({ where: { id: uid, reset_token: token } })
    if (user === null) {
      return res.status(404).send({ error: `invalid token or expired` })
    }

    // Encrypt new password
    const encryptedPassword = await encryptPassword(newPassword)
    if (encryptedPassword.err) {
      return res.status(500).send({ error: `Unable to encrypt user password` })
    }
    newPassword = encryptedPassword.hash
    await User.update(
      { reset_token: "", password: newPassword },
      { where: { id: uid } }
    )

    res.status(200).send({ success: "reset password successfully" })
  },
}
