const express = require("express")
const app = express()
const port = 3000
const cors = require("cors")
const user = require("./routes/user.route")
const product = require("./routes/product.route")
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

app.listen("4000", () => console.log(`listening on port ${port} `))
