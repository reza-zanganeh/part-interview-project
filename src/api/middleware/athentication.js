const { verifyJWT } = require("../security/jwt")
const { Unauthorized } = require("../helper/httpResponse")
const { createError } = require("../helper/functions")
const { modelName } = require("../../config/constant")
const { userModelName } = modelName
const secret = process.env.JWT_SECRET

module.exports.isAuthenticate = async (req, res, next) => {
  const token = req.headers?.accesstoken
  try {
    if (!token) return next(createError(Unauthorized()))

    const user = verifyJWT(token, secret)
    req[userModelName.english] = user
    req.body.userId = user.id
    next()
  } catch (error) {
    next(createError(Unauthorized()))
  }
}
