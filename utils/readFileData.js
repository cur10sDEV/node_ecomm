const path = require("path");
const rootDir = require("./path");
const fs = require("fs");

// only returns and reads json data
const readFileData = (folder, file) => {
  let products = [];
  fs.readFile(path.join(rootDir, folder, file), (err, data) => {
    if (!err) {
      products = JSON.parse(data);
    } else {
      console.log(err);
    }
  });
  return products;
};

module.exports = readFileData;
