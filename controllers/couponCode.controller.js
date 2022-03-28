const fs = require("fs")
const csv = require("csvtojson")
const Queue = require("bull")
const { CouponCode, Cart } = require("../models")

module.exports = {
  createCoupon: async (req, res) => {
    const readCsvQueue = new Queue("read-csv")
    await readCsvQueue.add({
      path: req.file.path,
      filename: req.file.filename,
    })

    readCsvQueue.process(async (job) => {
      const coupons = await csv().fromFile(job.data.path)
      fs.unlinkSync("./public/images/" + job.data.filename)
      await CouponCode.bulkCreate(coupons)
      console.log("job completed!")
      return
    })
    res.status(200).send()
  },

  applyCoupon: async (req, res) => {
    if (!req.query.code) {
      return res.status(400).send({ error: `coupon is missing` })
    }

    const coupon = await CouponCode.findOne({
      where: { code: req.query.code },
    })
    if (!coupon) return res.status(404).send({ error: "wrong coupon code" })

    const cart = await Cart.findOne({
      where: { uid: req.userID },
    })
    if (!cart || cart.total_before_discount == 0)
      return res
        .status(404)
        .send({ error: "Either cart does not exists or looks empty" })

    Cart.update(
      {
        total: (
          cart.total_before_discount -
          cart.total_before_discount * coupon.discount
        ).toFixed(2),
        coupon_code: coupon.code,
        coupon_id: coupon.id,
      },
      { where: { uid: req.userID } }
    )
      .then((response) => {
        if (response.length > 0 && response[0] > 0) {
          return res.status(200).send({
            ...cart.toJSON(),
            total: parseFloat(
              (
                cart.total_before_discount -
                cart.total_before_discount * coupon.discount
              ).toFixed(2)
            ),
            coupon_code: coupon.code,
            coupon_id: coupon.id,
          })
        }
        throw "something went wrong during applying coupon"
      })
      .catch((error) => {
        return res
          .status(500)
          .send({ error: "unable to update cart", message: error })
      })
  },
}
