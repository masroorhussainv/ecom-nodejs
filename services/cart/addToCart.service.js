const { Cart, CartItem } = require("../../models")
const getUserCart = require("./getUserCart.service")

module.exports = async (product, cart, userID) => {
  try {
    if (cart) {
      var cartItems = await CartItem.findOne({
        where: { cart_id: cart.id, product_id: product.id },
      })
      if (cartItems) {
        await CartItem.update(
          {
            quantity: ++cartItems.quantity,
            price: cartItems.price + product.price,
          },
          {
            where: { cart_id: cart.id, product_id: product.id },
          }
        )
      } else {
        await CartItem.create({
          product_id: product.id,
          cart_id: cart.id,
          quantity: 1,
          price: product.price,
          product_owner_id: product.uid,
        })
      }
      await Cart.update(
        {
          total: cart.total + product.price,
          total_before_discount: cart.total_before_discount + product.price,
        },
        { where: { uid: userID } }
      )

      const response = await getUserCart(userID)
      if (response.err) {
        return { err: response.err }
      }
      return { cart: response.cart }
    }

    cart = await Cart.create({
      uid: userID,
      total: product.price,
      total_before_discount: product.price,
    })
    await CartItem.create({
      product_id: product.id,
      cart_id: cart.id,
      quantity: 1,
      price: product.price,
      product_owner_id: product.uid,
    })

    const response = await getUserCart(userID)
    if (response.err) {
      return { err: response.err }
    }
    return { cart: response.cart }
  } catch (err) {
    return { err }
  }
}
