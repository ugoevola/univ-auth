const config = {
  MONGO_URL: process.env.MONGO_URL || "192.168.56.130:9200",
  LOG_LEVEL: process.env.LOG_LEVEL || "info"
};
module.exports = { config: config }
