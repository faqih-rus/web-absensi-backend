const { Sequelize } = require("sequelize");

//config database
const sequelize = new Sequelize("db_absensi", "root", "", {
  dialect: "mysql",
  host: "localhost",
  port: 3306,
});

module.exports = sequelize;