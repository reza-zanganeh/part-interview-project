const bcrypt = require("bcrypt")
const { createJWT } = require("../security/jwt")
const projectConfig = require("../../config/index")
const secret = process.env.JWT_SECRET

module.exports.createError = ({ statusCode, message }) => {
  const error = new Error()
  error.statusCode = statusCode
  error.message = message
  return error
}

module.exports.createAuthenticationToken = ({ userId, userRole }) => {
  const header = { alg: "HS256", typ: "JWT" }
  const payload = {
    userId,
    userRole,
    iat: Math.floor(Date.now() / 1000), // زمان ایجاد
    exp:
      Math.floor(Date.now() / 1000) +
      projectConfig.authentication.authenticationTokenExpiresTimeInMinute * 60, // انقضا: 24 ساعت
  }

  const token = createJWT(header, payload, secret)
  return token
}

module.exports.hashUserPassword = async (password) => {
  try {
    const hashedPass = await bcrypt.hash(password, 10)
    return hashedPass
  } catch (error) {
    throw error
  }
}

module.exports.compareUserPassword = async (passOne, passTwo) => {
  try {
    const resultOfcomparePassword = await bcrypt.compare(passOne, passTwo)
    return resultOfcomparePassword
  } catch (error) {
    throw error
  }
}
