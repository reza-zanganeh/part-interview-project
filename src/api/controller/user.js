const {
  hashUserPassword,
  createAuthenticationToken,
  createError,
  compareUserPassword,
} = require("../helper/functions")
const { modelName } = require("../../config/constant")
const { create, readOne, update } = require("../db/prisma/prisma")
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

    if (!user)
      return next(createError(BadRequest("رمز عبور یا نام کاربری اشتباه است")))

    const password = user.password

    const resultOfcomparePassword = await compareUserPassword(
      inputPassword,
      password
    )

    if (!resultOfcomparePassword)
      return next(createError(BadRequest("رمز عبور یا نام کاربری اشتباه است")))

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

    const { id, username, fullname, role } = userInfo

    resposeHandler(
      res,
      { id, username, fullname, role },
      Ok({ operationName: "دریافت اطلاعات" })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { userId } = req[userModelName.english]

    const {
      username: newUsername,
      password: newPassword,
      fullname: newFullname,
    } = req.body

    const updateData = {}
    if (newUsername) {
      const isUserExists = await readOne(userModelName.english, {
        username: newUsername,
      })

      if (isUserExists)
        return next(
          createError(
            BadRequest(
              "این نام کاربری قبلا ایجاد شده است لطفا از یک نام کاربری دیگر استفاده کنید"
            )
          )
        )

      updateData["username"] = newUsername
    }

    if (newPassword) {
      const hashedPass = await hashUserPassword(newPassword)
      updateData["password"] = hashedPass
    }

    if (newFullname) updateData["fullname"] = newFullname

    const updatedUser = await update(
      userModelName.english,
      { id: +userId },
      updateData
    )

    const { id, username, fullname, role } = updatedUser

    resposeHandler(
      res,
      { id, username, fullname, role },
      Ok({ operationName: "دریافت اطلاعات" })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}
