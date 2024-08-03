const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db.config");

class User extends Model {}

User.init(
  {
    nip: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
