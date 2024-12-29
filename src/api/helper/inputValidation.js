const { empty, limitLegth, invalid } = require("./validationMessage")
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

module.exports.inArray = (
  fieldName,
  location,
  array,
  checkIsExists = true
) => ({
  in: [location],
  ...(checkIsExists && {
    exists: {
      bail: true,
      options: {
        checkNull: true,
      },
      errorMessage: empty(fieldName),
      checkNull: true,
    },
  }),
  custom: {
    options: (value) => array.includes(value) || (!checkIsExists && !value),
    errorMessage: `باشد [ ${array.join(" , ")} ] ${fieldName} باید جزو `,
  },
})

module.exports.isString = (fieldName, location, checkIsExists = true) => ({
  in: [location],
  ...(checkIsExists && {
    exists: {
      bail: true,
      options: {
        checkNull: true,
      },
      errorMessage: empty(fieldName),
      checkNull: true,
    },
  }),
  custom: {
    options: (value) => typeof value === "string" || (!checkIsExists && !value),
    errorMessage: invalid(fieldName),
  },
})
