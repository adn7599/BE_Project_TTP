const mysql = require("mysql");
const config = require("../configuration.json");

const connection = mysql.createConnection({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
});

module.exports = connection;
