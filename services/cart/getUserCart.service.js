const { Cart, Product } = require("../../models")

module.exports = (userID) =>
  Cart.findOne({
    where: { uid: userID },
    include: {
      model: Product,
      through: { attributes: ["id", "quantity", "price"] },
    },
  })
    .then((cart) => {
      return { cart }
    })
    .catch((err) => {
      return { err }
    })
