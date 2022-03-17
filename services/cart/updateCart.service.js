const { Cart, CartItem } = require("../../models")
const getUserCart = require("./getUserCart.service")

module.exports = async (quantity, productId, userID, cartItem, cart, type) => {
  try {
    const price = cartItem.price / cartItem.quantity
    if (quantity == 0) {
      await CartItem.destroy({
        where: { cart_id: cart.id, product_id: productId },
      })
    } else {
      await CartItem.update(
        {
          quantity: quantity,
          price: price * quantity,
        },
        {
          where: { cart_id: cart.id, product_id: productId },
        }
      )
    }

    var total = cart.total
    var total_before_discount = cart.total_before_discount
    if (type === "increase") {
      total = total + price * (quantity - cartItem.quantity)
      total_before_discount =
        total_before_discount + price * (quantity - cartItem.quantity)
    } else {
      total = total - price * (cartItem.quantity - quantity)
      total_before_discount =
        total_before_discount - price * (cartItem.quantity - quantity)
    }

    await Cart.update(
      {
        total,
        total_before_discount,
      },
      { where: { uid: userID } }
    )

    const response = await getUserCart(userID)
    if (response.err) {
      return { err: response.err }
    }
    return { cart: response.cart }
  } catch (err) {
    return { err }
  }
}
