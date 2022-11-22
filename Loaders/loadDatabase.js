require("dotenv").config();

const mysql = require("mysql");

module.exports = async () => {
  let db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  return db;
};
