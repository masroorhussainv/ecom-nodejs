const couponCode = require("../controllers/couponCode.controller")
const router = require("express").Router()
const auth = require("../middlewares/auth.middleware")
const upload = require("../middlewares/uploadMedia.middleware")

router.post("/", auth, upload.single("file"), couponCode.createCoupon)
router.patch("/", auth, couponCode.applyCoupon)

module.exports = router
