const path = require("path");
const rootDir = require("./path");
const fs = require("fs");

// only returns and reads json data
const writeDataToFile = (folder, file, data) => {
  fs.writeFile(
    path.join(rootDir, folder, file),
    JSON.stringify(data),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

module.exports = writeDataToFile;
