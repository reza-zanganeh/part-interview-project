const {
  hashUserPassword,
  createAuthenticationToken,
  createError,
  compareUserPassword,
} = require("../helper/functions")
const { modelName } = require("../../config/constant")
const { create, readOne, update } = require("../helper/prisma")
const { Created, BadRequest, Ok } = require("../helper/httpResponse")
const {
  internalServerErrorHandler,
  resposeHandler,
} = require("../helper/responseHandler")
const { userModelName } = modelName
const projectConfig = require("../../config/index")

module.exports.register = async (req, res, next) => {
  try {
    const { username, password, fullname } = req.body

    const isUserExists = await readOne(userModelName.english, { username })

    if (isUserExists)
      return next(
        createError(
          BadRequest(
            "این نام کاربری قبلا ایجاد شده است لطفا از یک نام کاربری دیگر استفاده کنید"
          )
        )
      )

    const hashedPass = await hashUserPassword(password)

    const createdUser = await create(userModelName.english, {
      username,
      password: hashedPass,
      fullname,
    })

    const accesstoken = createAuthenticationToken({
      userId: createdUser.id,
      userRole: "Normal",
    })

    resposeHandler(
      res,
      {
        accesstoken,
        ExpiresTimeInMinute:
          projectConfig.authentication.authenticationTokenExpiresTimeInMinute,
        fullname,
      },
      Created("کاربر")
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { username, password: inputPassword } = req.body

    const user = await readOne(userModelName.english, {
      username,
    })

    if (!user) return next(createError(BadRequest("حساب کاربری شما یافت نشد")))

    const password = user.password

    const resultOfcomparePassword = await compareUserPassword(
      inputPassword,
      password
    )

    if (!resultOfcomparePassword) {
      return next(createError(BadRequest("رمز عبور وارد شده صحیح نمی باشد")))
    }
    // if true create and send token
    const accesstoken = createAuthenticationToken({
      userId: user.id,
      userRole: user.role,
    })
    // 7. send token in response
    resposeHandler(
      res,
      {
        accesstoken,
        ExpiresTimeInMinute:
          projectConfig.authentication.authenticationTokenExpiresTimeInMinute,
        fullname: user.fullname,
      },
      Ok({ operationName: "ورود" })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports.getMyInfo = async (req, res, next) => {
  try {
    const { userId } = req[userModelName.english]

    const userInfo = await readOne(userModelName.english, { id: +userId })

    resposeHandler(res, userInfo, Ok({ operationName: "دریافت اطلاعات" }))
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { userId } = req[userModelName.english]

    const { username, password, fullname } = req.body

    const updateData = {}
    if (username) {
      const isUserExists = await readOne(userModelName.english, { username })

      if (isUserExists)
        return next(
          createError(
            BadRequest(
              "این نام کاربری قبلا ایجاد شده است لطفا از یک نام کاربری دیگر استفاده کنید"
            )
          )
        )

      updateData["username"] = username
    }

    if (password) {
      const hashedPass = await hashUserPassword(password)
      updateData["password"] = hashedPass
    }

    if (fullname) updateData["fullname"] = fullname

    const updatedUser = await update(
      userModelName.english,
      { id: +userId },
      updateData
    )

    delete updatedUser.password

    resposeHandler(res, updatedUser, Ok({ operationName: "دریافت اطلاعات" }))
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}
