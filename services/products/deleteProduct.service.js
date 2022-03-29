const { Product, Image } = require("../../models")
const cloudinary = require("../../utils/cloudinary.util")

module.exports = async (userID, productId) => {
  try {
    var images = await Image.findAll({
      where: { product_id: productId },
    })

    const product = await Product.destroy({
      where: { uid: userID, id: productId },
    })
    if (product < 1) return { err: "wrong product id" }
    images.map(
      async (image) => await cloudinary.destroy(image.url.split(/[/.]/)[2])
    )

    return
  } catch (err) {
    return { err }
  }
}
