const path = require('path')

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
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
}
