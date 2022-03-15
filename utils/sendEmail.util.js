const nodemailer = require("nodemailer")

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to: email,
      subject: subject,
      html,
    })

    console.log("email sent successfully!")
    return true
  } catch (error) {
    console.log("email not sent", error)
    return false
  }
}

module.exports = sendEmail
