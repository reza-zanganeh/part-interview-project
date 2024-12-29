const path = require("path")
const { errorHandler, notFoundResponse } = require("../helper/responseHandler")
// const { isAuthenticate } = require("../middleware/athentication")
//#region import routers
const { userRouter } = require("./user")
//#endregion
module.exports.registerRoutes = (app) => {
  //#region add routes
  //#endregion
  app.use("*", notFoundResponse)
  app.use(errorHandler)
}
