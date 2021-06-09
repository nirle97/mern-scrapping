const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const pastes = require("./routes/pastes");
const analytics = require("./routes/analytics");
const mongoose = require("mongoose");
app.use("/pastes", pastes);
app.use("/analytics", analytics);

app.get("/", (req, res) => {
  res.send("hello");
});

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
    console.error("error connecting to MongoDB: ", error.message);
  });

io.on("connection", (socket) => {
  console.log("user connected: " + socket.id);
  socket.emit("pasteAlert", "ALERT!!!");
  socket.on("test", (data) => {
    console.log(data);
  });
});

server.listen(8080, () => console.log("app is listening on port 8080"));

module.exports = app;
