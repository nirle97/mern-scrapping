const mongoose = require("mongoose");
const { savePastes } = require("./utils/scrapper");
const schedule = require("node-schedule");

mongoose
  .connect("mongodb://localhost:27017/pastes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`scrapper connected to MongoDB`);
  })
  .catch((error) => {
    console.log("error connecting scrapper to MongoDB: " + error.message);
  });
savePastes();

// schedule.scheduleJob("*/40 * * * * *", function () {
//   console.log("Gathering Pastes..");
//   savePastes();
// });
