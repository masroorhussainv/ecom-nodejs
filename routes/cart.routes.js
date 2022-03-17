const cart = require("../controllers/cart.controller")
const router = require("express").Router()
const auth = require("../middlewares/auth.middleware")

router.post("/add/:id", auth, cart.addToCart)
router.put("/", auth, cart.updateCart)
router.delete("/product/:id", auth, cart.removeProduct)
router.delete("/clear", auth, cart.clear)

module.exports = router
