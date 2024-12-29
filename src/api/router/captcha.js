const express = require("express")

const captchaRouter = express.Router()
const { getCaptcha } = require("../controller/captcha")

captchaRouter.get("/", getCaptcha)

module.exports.captchaRouter = captchaRouter
