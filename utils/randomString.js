const crypto = require("crypto");

const randomString = async (len) => {
  const result = await crypto.randomBytes(len).toString("hex");
  return result;
};

module.exports = randomString;
