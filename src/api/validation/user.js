const { required, password, isString } = require("./inputValidation")

module.exports.registerSV = {
  username: required("نام کاربری", "body"),
  password: password("body"),
  fullname: required("نام کامل", "body"),
  captchaText: required("کپچا", "body"),
  uuid: required("کپچا", "body"),
}

module.exports.loginSV = {
  username: required("نام کاربری", "body"),
  password: password("body"),
  captchaText: required("کپچا", "body"),
  uuid: required("کپچا", "body"),
}

module.exports.updateSV = {
  username: isString("نام کاربری", "body", false),
  password: isString("رمز عبور", "body", false),
  fullname: isString("نام کامل", "body", false),
  accesstoken: required("توکن احراز هویت", "headers"),
}

module.exports.getMyInfoSV = {
  accesstoken: required("توکن احراز هویت", "headers"),
}
