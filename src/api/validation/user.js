const { required, password, isString } = require("../helper/inputValidation")

module.exports.registerSV = {
  username: required("نام کاربری", "body"),
  password: password("body"),
  fullname: required("نام کامل", "body"),
}

module.exports.loginSV = {
  username: required("نام کاربری", "body"),
  password: password("body"),
}

module.exports.updateSV = {
  username: isString("نام کاربری", "body", false),
  password: isString("رمز عبور", "body", false),
  fullname: isString("نام کامل", "body", false),
}
