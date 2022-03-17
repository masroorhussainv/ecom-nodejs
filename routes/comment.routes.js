const comment = require("../controllers/comment.controller")
const router = require("express").Router()
const auth = require("../middlewares/auth.middleware")

router.post("/", auth, comment.create)
router.get("/post/:id", auth, comment.findProductComments)
router.put("/", auth, comment.update)
router.delete("/:id", auth, comment.delete)

module.exports = router
