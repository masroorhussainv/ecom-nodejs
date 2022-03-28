const user = require("../controllers/user.controller")
const router = require("express").Router()
const uploadMedia = require("../middlewares/uploadMedia.middleware")

router.post("/signup", uploadMedia.single("profile_picture"), user.signUp)
router.post("/login", user.login)
router.post("/password/forgot", user.forgotPassword)
router.post("/password/reset", user.resetPassword)

module.exports = router
