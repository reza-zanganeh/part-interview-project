const { createError } = require("../helper/functions")
const { BadRequest } = require("../helper/httpResponse")
const { getCaptchaTextFromRedis } = require("../db/redis/captcha")
// TODO : input validation
module.exports.checkCaptcha = async (req, res, next) => {
  try {
    const { captchaText: inputCaptchaText, uuid } = req.body

    // if (!inputCaptchaText || !uuid)
    //   return next(createError(BadRequest("کپچا ارسال نشده است")))

    const savedCaptchaText = await getCaptchaTextFromRedis(uuid)

    if (!savedCaptchaText)
      return next(
        BadRequest(
          "کد کپچا به درستی وارد نشده است یا اعتبار ان به پایان رسیده است"
        )
      )

    if (inputCaptchaText.toLowerCase() !== savedCaptchaText.toLowerCase())
      return next(createError(BadRequest("لطفا کد کپچا را به درستی وارد کنید")))

    next()
  } catch (error) {
    next(
      createError(
        BadRequest(
          "کد کپچا به درستی وارد نشده است یا اعتبار ان به پایان رسیده است"
        )
      )
    )
  }
}
