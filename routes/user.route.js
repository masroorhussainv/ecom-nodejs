const user = require("../controllers/user.controller")
const router = require("express").Router()

router.post("/signup", user.signUp)
router.post("/login", user.login)
router.post("/password/forgot", user.forgotPassword)
router.post("/password/reset", user.resetPassword)

module.exports = router
