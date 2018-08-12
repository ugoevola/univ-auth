const config = {
  MONGO_URL: process.env.MONGO_URL || "192.168.198.130",
  MONGO_PORT: process.env.MONGO_PORT || "27017",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  ENTITIES_DIR : "src/repository/**/*.entity.ts"
};
module.exports = { config: config }
