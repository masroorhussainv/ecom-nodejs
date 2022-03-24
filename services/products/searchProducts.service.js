const { Product, Image } = require("../../models")
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
      include: [
        {
          model: Image,
          attributes: ["id", "url"],
        },
      ],
      attributes: ["id", "name", "description"],
    })
    return { products }
  } catch (err) {
    console.log(err)
    return { err }
  }
}
