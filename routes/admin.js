const express = require("express");
const router = express.Router();
const path = require("path");

// util functions
const rootDir = require("../utils/path");

router.get("/add", (req, res) => {
  res.sendFile(path.join(rootDir, "views", "admin.html"));
});

router.post("/add", (req, res) => {
  const { data } = req.body;
  console.log(data);
  res.redirect("/");
});

module.exports = router;
