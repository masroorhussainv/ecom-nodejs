module.exports = async (card, amount) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
    const token = await stripe.tokens.create({
      card: {
        number: card.number,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvc: card.cvc,
      },
    })
    if (!token.id) throw " "

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      source: token.id,
      description: "Ecommerce shoppig",
    })
    if (!(charge.status === "succeeded" || charge.status === "pending"))
      throw " "

    return { success: true, transactionId: charge.id }
  } catch (err) {
    return { success: false, err }
  }
}
