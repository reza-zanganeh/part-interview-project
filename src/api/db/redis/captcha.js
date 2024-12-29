const { getFromRedis, setOnRedis } = require("./index")

const projectConfig = require("../../../config/index")
const CAPTCHATEXT = "CAPTCHATEXT"
// folder structure
module.exports.setCaptchaTextOnRedis = async (uuid, captchaText) => {
  return await setOnRedis(
    `${CAPTCHATEXT}_${uuid}`,
    captchaText,
    projectConfig.db.captchaTextExpiresTimeInMinutes
  )
}

module.exports.getCaptchaTextFromRedis = async (uuid) => {
  return await getFromRedis(`${CAPTCHATEXT}_${uuid}`)
}
