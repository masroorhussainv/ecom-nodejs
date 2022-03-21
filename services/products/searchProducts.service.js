const { Product } = require("../../models")
const { Op } = require("sequelize")

module.exports = async (query) => {
  try {
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: "%" + query + "%" } },
          { description: { [Op.iLike]: "%" + query + "%" } },
        ],
      },
      attributes: ["id", "name", "description"],
    })
    return { products }
  } catch (err) {
    console.log(err)
    return { err }
  }
}
