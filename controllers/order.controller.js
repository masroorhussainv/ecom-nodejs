const cardSchema = require("../validators/card.validate")
const createOrder = require("../services/order/createOrder.service")
const deductPayment = require("../services/order/deductPayment.service")
const { Cart, CartItem, Product, Payment, Order, Image } = require("../models")
const getUserOrder = require("../services/order/getUserOrder.service")

const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
}

module.exports = {
  create: async (req, res) => {
    const { card } = req.body
    const cart = await Cart.findOne({ where: { uid: req.userID } })
    if (!cart) return res.status(400).send({ error: "no cart found" })

    // Validate card input
    const { error } = cardSchema.validate(card, options)
    if (error) return res.status(400).send({ error: error.details[0].message })

    const cartItems = await CartItem.findAll({ where: { cart_id: cart.id } })
    if (cartItems.length < 1)
      return res.status(400).send({ error: "your cart looks empty" })

    const deductedPayment = await deductPayment(card, cart.total)
    if (!deductedPayment.success)
      return res.status(404).send({
        error: "payment transaction failed",
        message: deductedPayment.err,
      })

    const result = await createOrder(
      deductedPayment.transactionId,
      cart,
      cartItems
    )
    if (result.err) {
      return res
        .status(422)
        .send({ error: "unable to create order", message: result.err })
    }
    return res.status(200).send(result.order)
  },

  findOrderById: async (req, res) => {
    const result = await getUserOrder(req.params.id)
    if (result.err) {
      console.log(result)
      return res
        .status(422)
        .send({ error: "wrong order id", message: result.err })
    }
    return res.status(200).send(result.order)
  },

  findAll: async (req, res) => {
    const condition = !req.isAdmin && { where: { uid: req.userID } }
    Order.findAll({
      ...condition,
      include: [
        {
          model: Product,
          through: { attributes: ["id", "quantity", "price"] },
          include: {
            model: Image,
            attributes: ["id", "url"],
          },
        },
        {
          model: Payment,
        },
      ],
      order: [
        ["id", "DESC"],
        [Product, Image, "id", "DESC"],
      ],
    })
      .then((response) => res.status(200).send(response))
      .catch((err) =>
        res.status(500).send({
          error: "something went wrong",
          message: err,
        })
      )
  },

  updateStatus: async (req, res) => {
    const { id, status } = req.body
    if (!req.isAdmin)
      return res.status(401).send({
        error: "Unauthorized access",
      })

    if (!(id && status))
      return res
        .status(400)
        .send({ error: `${id ? "status" : "id"} is required` })

    Order.update(
      { status: status },
      {
        where: { id: id },
      }
    )
      .then(async (response) => {
        if (response[0] < 1) throw " "
        res.status(200).send({ success: "Updated successfully" })
      })
      .catch((err) =>
        res.status(500).send({
          error: "something went wrong",
          message: err,
        })
      )
  },
}
