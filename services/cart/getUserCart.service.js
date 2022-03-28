const { Cart, Product, Image } = require("../../models")

module.exports = (userID) =>
  Cart.findOne({
    where: { uid: userID },
    include: {
      model: Product,
      include: {
        model: Image,
        attributes: ["id", "url"],
      },
      through: { attributes: ["id", "quantity", "price"] },
    },
    order: [[Product, Image, "id", "DESC"]],
  })
    .then((cart) => {
      if (!cart) throw " "
      return { cart }
    })
    .catch((err) => {
      return { err }
    })
