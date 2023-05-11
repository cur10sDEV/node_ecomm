const crypto = require("crypto");

const randomString = async () => {
  const result = await crypto.randomBytes(32).toString("hex");
  return result;
};

module.exports = randomString;
