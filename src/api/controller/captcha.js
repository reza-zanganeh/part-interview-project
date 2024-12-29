const {
  internalServerErrorHandler,
  resposeHandler,
} = require("../helper/responseHandler")
const svgCaptcha = require("svg-captcha")
const { v4: uuidv4 } = require("uuid")
const { setCaptchaTextOnRedis } = require("../db/redis/captcha")
const { Ok } = require("../helper/httpResponse")

module.exports.getCaptcha = async (req, res, next) => {
  try {
    const { data: image, text } = svgCaptcha.create({ size: 5, noise: 2 })

    const uuid = uuidv4()
    await setCaptchaTextOnRedis(uuid, text)

    resposeHandler(res, { image, uuid }, Ok({ operationName: "ایجاد کپچا" }))
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}
