const { Product, Image } = require("../../models")
const fs = require("fs/promises")

module.exports = async (userID, productId) => {
  try {
    var images = await Image.findAll({
      where: { product_id: productId },
    })

    const product = await Product.destroy({
      where: { uid: userID, id: productId },
    })
    if (product < 1) return { err: "wrong product id" }
    images.map((image) =>
      fs.unlink("./public/images/" + image.url.split("images/")[1])
    )

    return
  } catch (err) {
    return { err }
  }
}
