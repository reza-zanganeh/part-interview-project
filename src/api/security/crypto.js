const crypto = require("crypto")

const generateSecretKey = (length = 32) =>
  crypto.randomBytes(length).toString("base64")
