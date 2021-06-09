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
pastes.post("/new-scrape/:amount", (req, res) => {
  const newPastes = req.params.amount;
});

module.exports = pastes;
