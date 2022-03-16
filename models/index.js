const dbConfig = require("../config/db.config.js")
const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: "0",
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
})

sequelize
  .authenticate()
  .then((response) => {
    console.log("Connection has been established successfully.")
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error)
  })

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.User = require("./user.model.js")(sequelize, Sequelize)
db.Product = require("./product.model.js")(sequelize, Sequelize)
db.Image = require("./image.model.js")(sequelize, Sequelize)
db.Comment = require("./comment.model.js")(sequelize, Sequelize)
db.Cart = require("./cart.model.js")(sequelize, Sequelize)
db.Order = require("./order.model.js")(sequelize, Sequelize)
db.CouponCode = require("./couponCode.model.js")(sequelize, Sequelize)
db.CartItem = require("./cartItem.model.js")(sequelize, Sequelize)

// ****************** Mapping Relationships ******************

// User relations
db.User.hasMany(db.Product, {
  foreignKey: "uid",
})
db.User.hasMany(db.Comment, {
  foreignKey: "uid",
})
db.User.hasMany(db.Order, {
  foreignKey: "uid",
})
db.User.hasOne(db.Cart, {
  foreignKey: "uid",
})
db.Product.belongsTo(db.User, { foreignKey: "uid" })
db.Comment.belongsTo(db.User, { foreignKey: "uid" })
db.Order.belongsTo(db.User, { foreignKey: "uid" })
db.Cart.belongsTo(db.User, { foreignKey: "uid" })

// Product relations
db.Product.hasMany(db.Image, {
  foreignKey: "product_id",
  onDelete: "cascade",
  hooks: true,
})
db.Product.hasMany(db.Comment, {
  foreignKey: "product_id",
  onDelete: "cascade",
  hooks: true,
})
db.Image.belongsTo(db.Product, { foreignKey: "product_id" })
db.Comment.belongsTo(db.Product, { foreignKey: "product_id" })

// Cart relations
db.Cart.hasOne(db.CouponCode, {
  foreignKey: "cart_id",
})
db.CouponCode.belongsTo(db.Cart, { foreignKey: "cart_id" })

// Product cart many-to-many relation
db.Product.belongsToMany(db.Cart, {
  through: db.CartItem,
  as: "product_belongs_to_cart",
  foreignKey: "product_id",
})
db.Cart.belongsToMany(db.Product, {
  through: db.CartItem,
  as: "cart_product",
  foreignKey: "cart_id",
})

module.exports = db
