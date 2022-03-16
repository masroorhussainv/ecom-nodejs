const product = require("../controllers/product.controller")
const router = require("express").Router()
const auth = require("../middlewares/auth.middleware")
const uploadMedia = require("../middlewares/uploadMedia.middleware")

router.post("/", auth, uploadMedia.array("images"), product.create)
router.get("/:id", auth, product.findById)
router.get("/", auth, product.findAll)
router.put("/", auth, uploadMedia.array("images"), product.update)
router.delete("/:id", auth, product.delete)

module.exports = router
