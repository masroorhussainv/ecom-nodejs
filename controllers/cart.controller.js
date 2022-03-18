const { Cart, CartItem, Product } = require("../models")
const addToCart = require("../services/cart/addToCart.service")
const clearCart = require("../services/cart/clearCart.service")
const getUserCart = require("../services/cart/getUserCart.service")
const updateCart = require("../services/cart/updateCart.service")

module.exports = {
  addToCart: async (req, res) => {
    const product = await Product.findOne({ where: { id: req.params.id } })

    if (!product) {
      return res
        .status(400)
        .send({ error: "product not found", message: "wrong product id" })
    }
    if (product.uid == req.userID) {
      return res.status(422).send({
        error: "unable to add to cart",
        message: "cannot add your own products to cart",
      })
    }

    const cart = await Cart.findOne({ where: { uid: req.userID } })
    const result = await addToCart(product, cart, req.userID)
    if (result.err) {
      return res
        .status(422)
        .send({ error: "unable to add to cart", message: result.err })
    }
    return res
      .status(200)
      .send({ ...result.cart.toJSON(), guestToken: req.guestToken })
  },

  updateCart: async (req, res) => {
    const { productId, quantity } = req.body
    if (!(productId && quantity)) {
      return res
        .status(400)
        .send({ error: `${productId ? "quantity" : "product id"} is missing` })
    }
    const cart = await Cart.findOne({
      where: { uid: req.userID },
    })
    const cartItem = await CartItem.findOne({
      where: { product_id: productId, cart_id: cart.id },
    })

    if (!cartItem) {
      return res.status(400).send({
        error: "unable to update cart",
        message: "this product is not exists in your cart",
      })
    }
    if (cartItem.quantity == quantity) {
      return res.status(400).send({
        error: "unable to update cart",
        message: "already updated!",
      })
    }

    const result = await updateCart(
      quantity,
      productId,
      req.userID,
      cartItem,
      cart,
      cartItem.quantity < quantity ? "increase" : "decrease"
    )
    if (result.err) {
      return res
        .status(422)
        .send({ error: "unable to update cart", message: result.err })
    }
    return res.status(200).send(result.cart)
  },

  removeProduct: async (req, res) => {
    let cart = await Cart.findOne({ where: { uid: req.userID } })
    const cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id: req.params.id },
    })
    if (!cartItem)
      return res.status(422).send({
        error: "unable to remove product from cart",
        message: "product is not in cart",
      })

    CartItem.destroy({ where: { cart_id: cart.id, product_id: req.params.id } })
      .then(async (response) => {
        await Cart.update(
          {
            total: cart.total - cartItem.price,
            total_before_discount: cart.total_before_discount - cartItem.price,
          },
          { where: { uid: req.userID } }
        )

        response = await getUserCart(req.userID)
        if (response.err) throw "no cart found"
        return res.status(200).send(response.cart)
      })
      .catch((e) =>
        res
          .status(422)
          .send({ error: "unable to remove product from cart", message: e })
      )
  },

  clear: async (req, res) => {
    const result = await clearCart(req.userID)
    if (result?.error) {
      return res.status(422).send(result)
    }
    return res.status(200).send(result.cart)
  },

  getCart: async (req, res) => {
    const result = await getUserCart(req.userID)
    if (result?.err || !result.cart) {
      return res.status(404).send({ error: "no cart found" })
    }
    return res.status(200).send(result.cart)
  },
}
