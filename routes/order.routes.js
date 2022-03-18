const order = require("../controllers/order.controller")
const router = require("express").Router()
const auth = require("../middlewares/auth.middleware")

router.post("/", auth, order.create)
router.get("/:id", auth, order.findOrderById)
router.get("/", auth, order.findAll)
router.patch("/", auth, order.updateStatus)

module.exports = router
