const { Comment, Product } = require("../../models")

module.exports = async (productId, userID) => {
  try {
    const product = await Product.findOne({
      where: { id: productId, uid: userID },
    })
    if (!product) {
      throw "this post does not belongs to you"
    }

    const comments = await Comment.findAll({
      where: { product_id: productId },
    })
    return { comments }
  } catch (err) {
    return { err }
  }
}
