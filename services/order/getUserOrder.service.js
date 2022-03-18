const { Order, Product, Payment } = require("../../models")

module.exports = (id) =>
  Order.findOne({
    where: { id },
    include: [
      {
        model: Product,
        through: { attributes: ["id", "quantity", "price"] },
      },
      {
        model: Payment,
      },
    ],
  })
    .then((order) => {
      if (!order) throw " "
      return { order }
    })
    .catch((err) => {
      return { err }
    })
