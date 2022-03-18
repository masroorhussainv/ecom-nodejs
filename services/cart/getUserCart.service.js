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
      if (!cart) throw " "
      return { cart }
    })
    .catch((err) => {
      return { err }
    })
