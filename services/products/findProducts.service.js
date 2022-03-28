const { Product, Image } = require("../../models")

module.exports = (condition) =>
  Product.findAll({
    where: { ...condition },
    include: {
      model: Image,
      attributes: ["id", "url"],
    },
    order: [
      ["id", "DESC"],
      [Image, "id", "DESC"],
    ],
  })
    .then((products) => {
      return { products }
    })
    .catch((err) => {
      return { err }
    })
