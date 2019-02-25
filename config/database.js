module.exports = {
  development: {
    username: "root",
    password: "",
    database: "bicycle_dev",
    host: "127.0.0.1",
    dialect: "mysql",
    dialectOptions: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  },
  test: {
    username: "root",
    password: "",
    database: "bicycle_dev",
    host: "127.0.0.1",
    dialect: "mysql",
    dialectOptions: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: "mysql",
    dialectOptions: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      supportBigNumbers: true,
      bigNumberStrings: true
    }
  }
};
