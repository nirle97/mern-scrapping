const { Router } = require("express");
const pastes = Router();
const PasteModel = require("../mongo");
pastes.get("/", (req, res) => {
  PasteModel.find()
    .then((pastes) => {
      res.status(200).send(pastes);
    })
    .catch((e) => res.status(400).send(e.message));
});
pastes.get("/test", (req, res) => {
  res.status(200).send("Go To: /pastes");
});

module.exports = pastes;
