const express = require("express")
const { checkSchema } = require("express-validator")
const { expressValidationResultHandler } = require("../helper/responseHandler")
const {
  register,
  login,
  getMyInfo,
  updateUserInfo,
} = require("../controller/user")
const {
  loginSV,
  registerSV,
  updateSV,
  getMyInfoSV,
} = require("../validation/user")

const { isAuthenticate } = require("../middleware/athentication")
const { checkCaptcha } = require("../middleware/checkCaptcha")

const userRouter = express.Router()

// register user
userRouter.post(
  "/register",
  checkSchema(registerSV),
  expressValidationResultHandler,
  checkCaptcha,
  register
)
// login user
userRouter.post(
  "/login",
  checkSchema(loginSV),
  expressValidationResultHandler,
  checkCaptcha,
  login
)

userRouter.get(
  "/",
  checkSchema(getMyInfoSV),
  expressValidationResultHandler,
  isAuthenticate,
  getMyInfo
)

userRouter.patch(
  "/",
  checkSchema(updateSV),
  expressValidationResultHandler,
  isAuthenticate,
  updateUserInfo
)

module.exports.userRouter = userRouter
