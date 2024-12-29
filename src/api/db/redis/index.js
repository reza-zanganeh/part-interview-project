const redis = require("redis")
const client = redis.createClient(
  process.env.REDIS_HOST,
  process.env.REDIS_PORT
)

client.on("error", (err) => {
  console.log(
    "Please check that the Redis server is running\n",
    "redis error :>> \n",
    err
  )
  process.exit()
})

client.connect()

module.exports.setOnRedis = async (key, value, expiresIn) => {
  return await client.set(key, value, expiresIn ? { EX: expiresIn * 60 } : {})
}

module.exports.getFromRedis = async (key) => {
  return await client.get(key)
}

module.exports.deleteFromRedis = async (key) => {
  return await client.del(key)
}

module.exports.getTtlFromRedis = async (key) => {
  return await client.ttl(key)
}
