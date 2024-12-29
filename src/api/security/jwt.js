const crypto = require("crypto")

// token structure = header.payload.signature
const _base64UrlEncode = (str) => {
  return Buffer.from(str) // تبدیل رشته به بایت‌ها
    .toString("base64") // تبدیل بایت‌ها به Base64
    .replace(/=/g, "") // حذف کاراکترهای '='
    .replace(/\+/g, "-") // جایگزینی '+' با '-'
    .replace(/\//g, "_") // جایگزینی '/' با '_'
}

module.exports.createJWT = (header, payload, secret) => {
  const headerEncoded = _base64UrlEncode(JSON.stringify(header))
  const payloadEncoded = _base64UrlEncode(JSON.stringify(payload))
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  return `${headerEncoded}.${payloadEncoded}.${signature}`
}

module.exports.verifyJWT = (token, secret) => {
  const [headerEncoded, payloadEncoded, signature] = token.split(".")
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  if (signature !== expectedSignature) {
    throw new Error("Invalid signature!")
  }

  const payload = JSON.parse(
    Buffer.from(payloadEncoded, "base64").toString("utf-8")
  )

  // بررسی انقضای توکن
  const currentTime = Math.floor(Date.now() / 1000)
  if (payload.exp && currentTime > payload.exp) {
    throw new Error("Token has expired!")
  }

  return payload
}
