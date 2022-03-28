const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if (decodedToken.guestUser) throw " "
    req.userID = decodedToken.userID
    req.isAdmin = decodedToken.isAdmin

    next()
  } catch {
    res.status(401).send({
      error: "Unauthorized access",
    })
  }
}
