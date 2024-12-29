const { empty, limitLegth } = require("./validationMessage")
const { readOne } = require("../helper/prisma")

module.exports.password = (location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty("رمز عبور"),
  },
  isLength: {
    errorMessage: limitLegth("رمز عبور", 6),
    options: { min: 6 },
  },
})

module.exports.required = (fieldName, location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty(fieldName),
    checkNull: true,
  },
})

module.exports.checkExistsObjectWithIdInDb = (
  MODELNAME,
  location,
  addDataToBody,
  select = {}
) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty(MODELNAME.persian),
  },
  custom: {
    options: async (id, { req }) => {
      const object = await readOne(
        MODELNAME.english,
        { id: +id },
        { id: true, ...select }
      )
      if (!object)
        return Promise.reject(`${MODELNAME.persian} انتخابی شما معتبر نمی باشد`)
      if (addDataToBody) req[MODELNAME.english] = object
    },
  },
})
