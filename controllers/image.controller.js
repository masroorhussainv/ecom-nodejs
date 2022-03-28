const { Image } = require("../models")
const fs = require("fs")

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
      fs.unlinkSync("./public/images/" + image.url.split("images/")[1])
      res.status(200).send({ success: "Deleted successfully" })
    } catch (err) {
      console.log(err)
      res.status(404).send({ error: "not found", message: err })
    }
  },
}
