const { Product, Image } = require("../../models")

module.exports = async (userID, productId, name, description, images) => {
  try {
    var product = await Product.update(
      {
        name,
        description,
      },
      { where: { uid: userID, id: productId } }
    )

    if (product[0] < 1) {
      return { err: "wrong product id" }
    }

    // create images
    if (images) {
      images = images.map((image) => {
        return { url: "/static/images/" + image }
      })
      await Image.bulkCreate(
        images.map((image) => {
          return {
            url: image.url,
            product_id: productId,
          }
        })
      )

      return
    }

    return
  } catch (err) {
    return { err }
  }
}
