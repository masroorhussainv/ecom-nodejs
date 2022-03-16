const multer = require("multer")

// multer stores image locally
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/images")
  },
  filename: function (req, file, callback) {
    const fileName = `${file.fieldname}_${Date.now()}`
    callback(null, fileName)

    if (!req.fileNames) req.fileNames = []
    req.fileNames.push(fileName)
  },
})

const upload = multer({
  storage: storage,
})

module.exports = upload
