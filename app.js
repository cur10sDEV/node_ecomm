const express = require("express");
const app = express();
const path = require("path");

// local imports
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
// util functions
const rootDir = require("./utils/path");

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// public assets
app.use(express.static(path.join(__dirname, "public")));

// admin routes
app.use("/admin", adminRouter);
app.use(shopRouter);

// 404 page
app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
});

app.listen(3000, () => console.log(`Server started successfully`));
