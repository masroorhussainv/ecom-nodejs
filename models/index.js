const dbConfig = require("../config/db.config.js")
const Sequelize = require("sequelize")

const sequelize =
  process.env.NODE_ENV === "production"
    ? new Sequelize(process.env.DATABASE_URL, {
        logging: false,
        ssl: true,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      })
    : new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
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
db.Payment = require("./payment.model.js")(sequelize, Sequelize)
db.CouponCode = require("./couponCode.model.js")(sequelize, Sequelize)
db.CartItem = require("./cartItem.model.js")(sequelize, Sequelize)
db.OrderItem = require("./orderItem.model.js")(sequelize, Sequelize)

// ****************** Mapping Relationships ******************

// User relations
db.User.hasMany(db.Product, {
  foreignKey: "uid",
  onDelete: "cascade",
  hooks: true,
})
db.User.hasMany(db.Comment, {
  foreignKey: "uid",
  onDelete: "cascade",
  hooks: true,
})
db.User.hasMany(db.Order, {
  foreignKey: "uid",
  onDelete: "cascade",
  hooks: true,
})
db.User.hasMany(db.Payment, {
  foreignKey: "uid",
  onDelete: "cascade",
  hooks: true,
})
db.User.hasOne(db.Cart, {
  foreignKey: "uid",
  onDelete: "cascade",
  hooks: true,
})
db.Product.belongsTo(db.User, { foreignKey: "uid" })
db.Comment.belongsTo(db.User, { foreignKey: "uid" })
db.Order.belongsTo(db.User, { foreignKey: "uid" })
db.Payment.belongsTo(db.User, { foreignKey: "uid" })
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
db.CouponCode.hasMany(db.Cart, {
  foreignKey: "coupon_id",
})
db.Cart.belongsTo(db.CouponCode, { foreignKey: "coupon_id" })

// Order relations
db.CouponCode.hasMany(db.Order, {
  foreignKey: "coupon_id",
})
db.Order.hasOne(db.Payment, {
  foreignKey: "order_id",
})
db.Order.belongsTo(db.CouponCode, { foreignKey: "coupon_id" })
db.Payment.belongsTo(db.Order, { foreignKey: "order_id" })

// Product cart many-to-many relation
db.Product.belongsToMany(db.Cart, {
  through: db.CartItem,
  foreignKey: "product_id",
})
db.Cart.belongsToMany(db.Product, {
  through: db.CartItem,
  foreignKey: "cart_id",
})

// Product order many-to-many relation
db.Product.belongsToMany(db.Order, {
  through: db.OrderItem,
  foreignKey: "product_id",
})
db.Order.belongsToMany(db.Product, {
  through: db.OrderItem,
  foreignKey: "order_id",
})

module.exports = db
