const UsersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");

const passwordCheck = async (nip, password) => {
  try {
    const user = await UsersModel.findOne({ where: { nip } });
    if (!user) {
      return { compare: false, userData: null };
    }
    const compare = await bcrypt.compare(password, user.password);
    return { compare, userData: user };
  } catch (error) {
    console.error("Error in password check:", error);
    return { compare: false, userData: null };
  }
};

module.exports = passwordCheck;
