const config = require("../configuration.json");

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASS,
  {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT,
    logging: console.log,
  }
);

async function isDbConnected() {
  let isConnected = true;
  try {
    await sequelize.authenticate();
    console.log(`Database connected at ${config.DB_HOST} : ${config.DB_PORT}`);
  } catch (error) {
    isConnected = false;
    console.log("Unable to connect the Database!!", error);
  }
  return isConnected;
}
let db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.isDbConnected = isDbConnected;

module.exports = db;
