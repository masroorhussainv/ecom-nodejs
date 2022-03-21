const { Order, OrderItem, Payment } = require("../../models")
const getUserOrder = require("./getUserOrder.service")
const clearCart = require("../cart/clearCart.service")

module.exports = async (transactionId, cart, cartItems) => {
  try {
    let order = await Order.create({
      status: "pending",
      coupon_code: cart.coupon_code,
      total: cart.total,
      discount: (cart.total_before_discount - cart.total).toFixed(2),
      uid: cart.uid,
      coupon_id: cart.coupon_id,
    })
    await Payment.create({
      transaction_id: transactionId,
      uid: cart.uid,
      order_id: order.id,
    })

    const orderItems = cartItems.map((item) => {
      return {
        product_id: item.product_id,
        order_id: order.id,
        quantity: item.quantity,
        price: item.price,
      }
    })
    await OrderItem.bulkCreate(orderItems)
    response = await getUserOrder(order.id)
    if (response.err) throw " "
    await clearCart(cart.uid)

    return { order: response.order }
  } catch (err) {
    return { err }
  }
}
