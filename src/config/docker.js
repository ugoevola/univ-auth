const config = {
  MONGO_URL: process.env.MONGO_URL || "univ_auth_mongo",
  MONGO_PORT: process.env.MONGO_PORT || "27017",
  LOG_LEVEL: process.env.LOG_LEVEL || "info"
};
module.exports = { config: config }
