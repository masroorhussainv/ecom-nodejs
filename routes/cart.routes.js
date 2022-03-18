const cart = require("../controllers/cart.controller")
const router = require("express").Router()
const guestAuth = require("../middlewares/guestAuth.middleware")

router.post("/add/:id", guestAuth, cart.addToCart)
router.get("/", guestAuth, cart.getCart)
router.put("/", guestAuth, cart.updateCart)
router.delete("/product/:id", guestAuth, cart.removeProduct)
router.delete("/clear", guestAuth, cart.clear)

module.exports = router
