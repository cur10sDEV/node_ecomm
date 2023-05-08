const bcrypt = require("bcryptjs");

const checkPassword = async (password, hashedPassword) => {
  try {
    const res = await bcrypt.compare(password, hashedPassword);
    return res;
  } catch (err) {
    console.error(err);
  }
};

const genHashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { checkPassword, genHashedPassword };
