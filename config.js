
require('dotenv').config();

module.exports = {
  port: 9000,
  corsWhitelist: [],
  jwt: {
    secret: process.env.JWT_SECRET,
    duration: process.env.JWT_DURATION
  },
  // Database
  development: {
    port: 3306, 
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    timezone: '+08:00',
    dialect: 'mysql',
  },
  test: {
    port: 3306,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
    timezone: '+08:00',
    dialect: 'mysql',
  },
  production: {
    port: 3306,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    timezone: '+08:00',
    dialect: 'mysql',
    logging: null
  }
}
  