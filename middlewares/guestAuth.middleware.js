const jwt = require("jsonwebtoken")
const { User } = require("../models")
module.exports = async (req, res, next) => {
  try {
    var token = req.headers.authorization?.split(" ")[1]

    if (!token && req?.url?.includes("/add/")) {
      const user = await User.create({
        guest_token: "",
      })
      token = jwt.sign(
        {
          guestUser: true,
          userID: user.id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      )
      await User.update(
        {
          guest_token: token,
        },
        { where: { id: user.id } }
      )
      req.guestToken = token
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.userID = decodedToken.userID

    next()
  } catch (e) {
    res.status(401).send({
      error: "No cart found",
    })
  }
}
