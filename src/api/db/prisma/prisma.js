const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports.create = async (modelName, data) => {
  try {
    const newRecord = await prisma[modelName].create({
      data,
    })
    return newRecord
  } catch (error) {
    throw error
  }
}

module.exports.readOne = async (modelName, where, select) => {
  try {
    let result
    if (select) result = await prisma[modelName].findFirst({ where, select })
    else result = await prisma[modelName].findFirst({ where })

    return result
  } catch (error) {
    throw error
  }
}

module.exports.readAll = async (modelName, query) => {
  try {
    const result = await prisma[modelName].findMany(query)
    return result
  } catch (error) {
    throw error
  }
}

module.exports.update = async (modelName, where, data) => {
  try {
    const updatedRecord = await prisma[modelName].update({
      where,
      data,
    })
    return updatedRecord
  } catch (error) {
    throw error
  }
}

module.exports.remove = async (modelName, where, select) => {
  try {
    let deletedRecord
    if (select) {
      deletedRecord = await prisma[modelName].delete({
        where,
        select,
      })
    } else {
      deletedRecord = await prisma[modelName].delete({
        where,
      })
    }
    return deletedRecord
  } catch (error) {
    throw error
  }
}
