const { Image } = require("../models")
const fs = require("fs")
const cloudinary = require("../utils/cloudinary.util")

module.exports = {
  delete: async (req, res) => {
    if (!req.isAdmin)
      return res.status(401).send({ error: "Unauthorized access" })
    try {
      var image = await Image.findOne({
        where: { id: req.params.id },
      })

      if (!image)
        return res
          .status(404)
          .send({ error: "not found", message: "wrong image id" })

      image = image.toJSON()
      await Image.destroy({
        where: { id: req.params.id },
      })
      cloudinary.destroy(image.url.split(/[/.]/)[2])

      res.status(200).send({ success: "Deleted successfully" })
    } catch (err) {
      res.status(404).send({ error: "not found", message: err })
    }
  },
}
