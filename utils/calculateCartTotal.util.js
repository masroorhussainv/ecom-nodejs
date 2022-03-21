const { CouponCode } = require("../models")

module.exports = async (cart, total_before_discount) => {
  if (cart.coupon_id) {
    const coupon = await CouponCode.findOne({ id: cart.coupon_id })
    return (
      total_before_discount -
      total_before_discount * coupon.discount
    ).toFixed(2)
  }
  return total_before_discount
}
