module.exports.Ok = ({ operationName, message }) => ({
  statusCode: 200,
  message: message ? message : `${operationName} با موفقیت انجام شد`,
})

module.exports.emptyMesssage = () => ({
  statusCode: 200,
  message: "",
})

module.exports.Created = (recordName) => ({
  statusCode: 201,
  message: `${recordName} با موفقیت ساخته شد`,
})

module.exports.BadRequest = (additionalInfo) => ({
  statusCode: 400,
  message: additionalInfo
    ? additionalInfo
    : "درخواست معتبر نمی باشد لطفا داده های ورودی را کنترل کنید",
})

module.exports.Unauthorized = (requestName) => ({
  statusCode: 401,
  message: `انجام ${requestName || "این عملیات"} نیاز به ثبت نام / ورود دارد`,
})

module.exports.PaymentRequired = (requestName) => ({
  statusCode: 402,
  message: `انجام ${requestName} نیازمند پرداخت وجه است`,
})

module.exports.Forbidden = (requestName) => ({
  statusCode: 403,
  message: `شما دسترسی لازم برای انجام ${
    requestName || "این عملیات"
  } را ندارید`,
})

module.exports.ForbiddenBlockUser = (reason) => ({
  statusCode: 403,
  message: `کاربر گرامی حساب کاربری شما ${
    reason ? `به علت ${reason} مسدود شده است` : "مسدود شده است"
  } . برای رفع مسدودیت از طریق فرم ارتباط باما برای پشتیبان پیام بگذارید`,
})

module.exports.NotFound = () => ({
  statusCode: 404,
  message: "مسیر مورد نظر یافت نشد",
})

module.exports.InternalServerError = (message) => ({
  statusCode: 500,
  message:
    message ||
    "سرور دچار مشکل داخلی شده است . لطفا صبور باشید در حال حل مشکل هستیم",
})

module.exports.ServiceUnavailable = (serviceName) => ({
  statusCode: 503,
  message: `سرویس ${serviceName} در دسترس نمی باشد`,
})
