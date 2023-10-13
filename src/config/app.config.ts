export const AppConfig = () => ({
  environment: process.env.NODE_ENV || 'development',
  dbPassword: process.env.DATABASE_PASSWORD,
  dbUser: process.env.DATABASE_USERNAME,
  dbName: process.env.DATABASE,
  dbPort: process.env.DATABASE_PORT,
  dbHost: process.env.DATABASE_HOST,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  paginationLimit: process.env.PAGINATION_LIMIT,
  paginationOffset: process.env.PAGINATION_OFFSET,
});
