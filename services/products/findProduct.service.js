const { Product, Image, Comment } = require("../../models")

module.exports = (condition) =>
  Product.findOne({
    where: { ...condition },
    include: [
      {
        model: Image,
        attributes: ["id", "url"],
      },
      { model: Comment },
    ],
  })
    .then((product) => {
      if (product) {
        return { product }
      } else {
        return { err: "wrong product id" }
      }
    })
    .catch((err) => {
      console.log(err)
      return { err }
    })
