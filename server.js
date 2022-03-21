const express = require("express")
const app = express()
const port = 3000
const cors = require("cors")
const user = require("./routes/user.routes")
const product = require("./routes/product.routes")
const image = require("./routes/image.routes")
const comment = require("./routes/comment.routes")
const cart = require("./routes/cart.routes")
const order = require("./routes/order.routes")
const coupon = require("./routes/couponCode.routes")
require("dotenv").config()

const corsOptions = {
  origin: "*",
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require("./models")
db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.")
})

app.use("/static", express.static("public"))
app.use("/user", user)
app.use("/product", product)
app.use("/image", image)
app.use("/comment", comment)
app.use("/cart", cart)
app.use("/order", order)
app.use("/coupon", coupon)

app.listen("4000", () => console.log(`listening on port ${port} `))
