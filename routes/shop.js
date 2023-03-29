const express = require("express");
const router = express.Router();
const path = require("path");

// util functions
const rootDir = require("../utils/path");

router.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
