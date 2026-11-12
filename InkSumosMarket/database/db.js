const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "inksumosapp",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
    timezone: "-03:00"
  }
);

module.exports = sequelize;