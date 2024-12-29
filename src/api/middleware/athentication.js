const { verifyJWT } = require("../security/jwt")
const { Unauthorized, BadRequest } = require("../helper/httpResponse")
const { createError } = require("../helper/functions")
const { modelName } = require("../../config/constant")
const { readOne } = require("../db/prisma/prisma")
const { userModelName } = modelName
const secret = process.env.JWT_SECRET

module.exports.isAuthenticate = async (req, res, next) => {
  const token = req.headers.accesstoken
  try {
    const userDataInJWT = verifyJWT(token, secret)

    const user = await readOne(userModelName.english, {
      id: +userDataInJWT.userId,
    })

    if (!user)
      return next(createError(BadRequest("اطلاعات کاربر معتبر نمی باشد")))

    req[userModelName.english] = user
    next()
  } catch (error) {
    next(createError(Unauthorized()))
  }
}
