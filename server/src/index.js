const express = require("express");
const app = express();
const pastes = require("./routes/pastes");
const analytics = require("./routes/analytics");
const mongoose = require("mongoose");
app.use("/pastes", pastes);
app.use("/analytics", analytics);

mongoose
  .connect("mongodb://mongodb:27017/pastes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`server connected to MongoDB`);
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
app.listen(8080, () => console.log("app listening on port 8080"));

module.exports = app;
