const express = require("express")
const { checkSchema } = require("express-validator")
const { expressValidationResultHandler } = require("../helper/responseHandler")
const {
  register,
  login,
  getMyInfo,
  updateUserInfo,
} = require("../controller/user")
const { loginSV, registerSV, updateSV } = require("../validation/user")

const { isAuthenticate } = require("../middleware/athentication")
const { checkCaptcha } = require("../middleware/checkCaptcha")

const userRouter = express.Router()

// register user
userRouter.post(
  "/register",
  checkCaptcha,
  checkSchema(registerSV),
  expressValidationResultHandler,
  register
)
// login user
userRouter.post(
  "/login",
  checkCaptcha,
  checkSchema(loginSV),
  expressValidationResultHandler,
  login
)
// get my data
userRouter.get("/", isAuthenticate, getMyInfo)

// update my data
userRouter.patch(
  "/",
  isAuthenticate,
  checkSchema(updateSV),
  expressValidationResultHandler,
  updateUserInfo
)

module.exports.userRouter = userRouter
