const { Cart, CartItem, Product } = require("../../models")
const getUserCart = require("./getUserCart.service")

module.exports = async (userID) => {
  let cart = await Cart.findOne({ where: { uid: userID } })
  return CartItem.destroy({ where: { cart_id: cart.id } })
    .then(async (response) => {
      await Cart.update(
        {
          total: 0,
          total_before_discount: 0,
          coupon_code: null,
          coupon_id: null,
        },
        { where: { uid: userID } }
      )

      response = await getUserCart(userID)
      if (response.err) throw "no cart found"
      return response
    })
    .catch((e) => {
      console.log(e)
      return { error: "unable to clear cart", message: e }
    })
}
