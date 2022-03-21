const { Cart, CartItem, User } = require("../../models")
const { Op } = require("sequelize")
const calculateCartTotal = require("../../utils/calculateCartTotal.util")

const mergeCartItems = (arrOne, arrTwo, cart) => {
  const mergedArr = arrOne
  arrTwo.map((item) => {
    let temp = {}
    let tempIndex = 0
    arrOne.filter((itemTwo, index) => {
      if (itemTwo.product_id === item.product_id) {
        temp = itemTwo
        tempIndex = index
      }
      return itemTwo.product_id === item.product_id
    }).length > 0
      ? (mergedArr[tempIndex] = {
          ...temp,
          quantity: item.quantity + temp.quantity,
          price: item.price + temp.price,
        })
      : mergedArr.push({ ...item, cart_id: cart.id })
  })
  return mergedArr
}

module.exports = async (userID, guestUserId) => {
  const guestCart = await Cart.findOne({ where: { uid: guestUserId } })

  if (guestCart && guestCart.total_before_discount != 0) {
    const cart = await Cart.findOne({ where: { uid: userID } })

    if (cart && cart.total_before_discount != 0) {
      var cartItems = await CartItem.findAll({
        where: {
          cart_id: cart.id,
        },
      })
      var guestCartItems = await CartItem.findAll({
        where: {
          cart_id: guestCart.id,
          product_owner_id: { [Op.ne]: userID },
        },
      })

      cartItems = cartItems.map((item) => item.toJSON())
      guestCartItems = guestCartItems.map((item) => item.toJSON())
      const mergedArr = mergeCartItems(cartItems, guestCartItems, cart)
      const itemsTotalPrice = guestCartItems.reduce(
        (previousValue, currentValue) => {
          return {
            price: previousValue.price + currentValue.price,
          }
        },
        { price: 0 }
      ).price

      const total = await calculateCartTotal(
        cart,
        cart.total_before_discount + itemsTotalPrice
      )
      await Cart.update(
        {
          total,
          total_before_discount: cart.total_before_discount + itemsTotalPrice,
        },
        { where: { uid: userID } }
      )
      await Promise.all(
        mergedArr.map(
          async (ele, index) =>
            await CartItem.update(ele, {
              where: { id: ele.id },
            })
        )
      )
    } else {
      await CartItem.destroy({
        where: { cart_id: guestCart.id, product_owner_id: userID },
      })
      await Cart.destroy({ where: { uid: userID } })

      const cartItems = await CartItem.findAll({
        where: { cart_id: guestCart.id },
      })
      const itemsTotalPrice = cartItems.reduce(
        (previousValue, currentValue) => {
          return {
            price: previousValue.price + currentValue.price,
          }
        },
        { price: 0 }
      ).price

      await Cart.update(
        {
          uid: userID,
          total: itemsTotalPrice,
          total_before_discount: itemsTotalPrice,
        },
        { where: { uid: guestUserId } }
      )
    }
  }
  await User.destroy({ where: { id: guestUserId } })
  return
}
