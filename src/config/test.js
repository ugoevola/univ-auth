const config = {
  MONGO_URL: process.env.MONGO_URL || 'localhost',
  MONGO_PORT : process.env.MONGO_PORT || 27017,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  SWAGGER_ACTIVATED: process.env.SWAGGER_ACTIVATED || false,
};
module.exports = { config: config }
