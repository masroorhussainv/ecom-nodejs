const { Comment, Product } = require("../../models")

module.exports = async (description, productId, userID) => {
  try {
    const product = await Product.findOne({
      where: { id: productId, uid: userID },
    })
    if (product) {
      throw "cannot comment on your own product"
    }

    const comment = await Comment.create({
      description,
      product_id: productId,
      uid: userID,
    })
    return { comment }
  } catch (err) {
    return { err }
  }
}
