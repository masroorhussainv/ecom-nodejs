const image = require("../controllers/image.controller")
const router = require("express").Router()
const auth = require("../middlewares/auth.middleware")

router.delete("/:id", auth, image.delete)

module.exports = router
