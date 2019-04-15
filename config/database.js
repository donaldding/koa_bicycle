// require('dotenv').config()
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '.env')
})

module.exports = {
  development: {
    username: 'postgres',
    password: process.env.LOCAL_DB_PASSWORD || '',
    database: 'bicycle_dev',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  },
  test: {
    logging: false,
    username: 'postgres',
    password: process.env.LOCAL_DB_PASSWORD || '',
    database: 'bicycle_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  },
  production: {
    username: 'postgres',
    password: 'postgres',
    database: 'bicycle_production',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
}
