const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db.config");

class Absensi extends Model {}

Absensi.init(
  {
    users_nip: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("in", "out"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Absensi",
    tableName: "absensis", 
    timestamps: true, 
  }
);

module.exports = Absensi;
