const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const pastes = require("./routes/pastes");
const analytics = require("./routes/analytics");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/pastes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`server connected to MongoDB`);
  })
  .catch((error) => {
    console.error("error connecting to MongoDB: ", error.message);
  });

io.on("connection", (socket) => {
  socket.on("newPastes", (newPastes) => {
    socket.broadcast.emit("pasteAlert", newPastes);
  });
});
app.use("/pastes", pastes);
app.use("/analytics", analytics);

server.listen(8080, () => console.log("app is listening on port 8080"));

module.exports = app;
