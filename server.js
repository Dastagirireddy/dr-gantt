const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use("/dist", express.static(path.join(__dirname, "./dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

app.listen(port, () => {
  console.log(`Express Listening on port ${port}`);
});
