const config = {
  MONGO_URL: process.env.MONGO_URL || "localhost",
  MONGO_PORT: process.env.MONGO_PORT || "27017",
  SERVER_PORT: process.env.SERVER_PORT || "3000",
  SERVER_PATH: process.env.SERVER_PATH || "/auth",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  AUTH_TOKEN_NAME: process.env.AUTH_TOKEN_NAME || "Authorization",
  AUTH_JWT_KEY: process.env.AUTH_JWT_KEY || "I015U2VjcmV0SldUNCFJbmV4eXM=",
  SWAGGER_ACTIVATED: process.env.SWAGGER_ACTIVATED || true,
  ADMIN_ACCOUNT: process.env.ADMIN_ACCOUNT || 'admin@univ-auth.fr',
  ADMIN_PWD : process.env.ADMIN_PWD || 'univ-auth-s3cr3t'
};
module.exports = { config: config }
