const mongoose = require("mongoose");
const { savePastes } = require("./utils/scrapper");
const socketClient = require("socket.io-client");
const baseUrl = "http://localhost:8080";
const schedule = require("node-schedule");

mongoose
  .connect("mongodb://mongodb:27017/pastes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`scrapper connected to MongoDB`);
  })
  .catch((error) => {
    console.log("error connecting scrapper to MongoDB:", error.message);
  });

schedule.scheduleJob("*/120 * * * * *", function () {
  console.log("Gathering Pastes..");
  savePastes();
});
