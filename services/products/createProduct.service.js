const { Product, Image } = require("../../models")
const crypto = require("crypto")

module.exports = async (userID, name, description, images) => {
  try {
    var product = await Product.create({
      name,
      description,
      sku: crypto.randomBytes(10).toString("hex"),
      uid: userID,
    })

    product = product.toJSON()
    // create images
    if (images) {
      images = images.map((image) => {
        return { url: "/static/images/" + image }
      })
      await Image.bulkCreate(
        images.map((image) => {
          return {
            url: image.url,
            product_id: product.id,
          }
        })
      )

      return {
        product: {
          ...product,
          Images: images,
        },
      }
    }

    return {
      product: {
        ...product,
        Images: [],
      },
    }
  } catch (err) {
    return { err }
  }
}
