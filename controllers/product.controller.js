const productSchema = require("../validators/product.validate")
const findProducts = require("../services/products/findProducts.service")
const findProduct = require("../services/products/findProduct.service")
const createProduct = require("../services/products/createProduct.service")
const updateProduct = require("../services/products/updateProduct.service")
const deleteProduct = require("../services/products/deleteProduct.service")

const options = {
  errors: {
    wrap: {
      label: "",
    },
  },
}

module.exports = {
  create: async (req, res) => {
    const { name, description } = req.body
    // Validate product input
    const { error } = productSchema.validate(req.body, options)
    if (error) return res.status(400).send({ error: error.details[0].message })

    // Create product with images
    const result = await createProduct(
      req.userID,
      name,
      description,
      req.fileNames
    )
    if (result.err) {
      return res
        .status(422)
        .send({ error: "failed to create product", message: result.err })
    }
    return res.status(201).send(result.product)
  },

  findAll: async (req, res) => {
    // find all products
    const result = await findProducts({ uid: req.userID })
    if (result.err) {
      return res
        .status(404)
        .send({ error: "products not found", message: result.err })
    }
    return res.status(200).send(result.products)
  },

  findById: async (req, res) => {
    // find a product
    const result = await findProduct({ uid: req.userID, id: req.params.id })
    if (result.err) {
      return res
        .status(404)
        .send({ error: "product not found", message: result.err })
    }
    return res.status(200).send(result.product)
  },

  update: async (req, res) => {
    const { name, description, productId } = req.body
    // Validate product input
    if (!(name && productId))
      return res
        .status(400)
        .send({ error: `${name ? "product id" : "name"} is required` })

    // update product
    const result = await updateProduct(
      req.userID,
      productId,
      name,
      description,
      req.fileNames
    )
    if (result?.err) {
      return res
        .status(422)
        .send({ error: "failed to update product", message: result.err })
    }
    return res.status(200).send({ success: "Updated successfully" })
  },

  delete: async (req, res) => {
    const result = await deleteProduct(req.userID, req.params.id)
    if (result?.err) {
      return res.status(404).send({ error: "not found", message: result.err })
    }
    return res.status(200).send({ success: "Deleted successfully" })
  },
}
