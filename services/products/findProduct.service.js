const { Product, Image, Comment, User } = require("../../models")

module.exports = (condition) =>
  Product.findOne({
    where: { ...condition },
    include: [
      {
        model: Image,
        attributes: ["id", "url"],
      },
      {
        model: Comment,
        include: {
          model: User,
          attributes: ["id", "username", "email", "profile_picture", "isAdmin"],
        },
      },
    ],
    order: [
      [Comment, "id", "DESC"],
      [Image, "id", "DESC"],
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
      return { err }
    })
