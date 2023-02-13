const bcrypt = require("bcrypt");
const saltRounds = 10;

// melakukan hashing password
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    return null;
  }
};

//melakukan pengecekan dari password yang di input
const hashMatch = async (passwordFromLogin, hashedPasswordFromDatabase) => {
  try {
    let match = await bcrypt.compare(
      passwordFromLogin,
      hashedPasswordFromDatabase
    );
    return match;
  } catch (error) {
    return false;
  }
};

module.exports = {
  hashPassword,
  hashMatch,
};
