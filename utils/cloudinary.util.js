const cloudinary = require("cloudinary").v2
const fs = require("fs")
require("dotenv").config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports.uploads = (fileName) => {
  return new Promise((resolve) =>
    cloudinary.uploader.upload(
      "./public/images/" + fileName,
      function (error, result) {
        fs.unlinkSync("./public/images/" + fileName)
        resolve(result?.url ? result.url.split("/upload")[1] : "")
      }
    )
  )
}

module.exports.destroy = (fileName) => {
  return new Promise((resolve) =>
    cloudinary.uploader.destroy(fileName, function (error, result) {
      resolve(result)
    })
  )
}
