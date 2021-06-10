const PasteModel = require("../db/models/mongo");

exports.getPastes = (req, res) => {
  PasteModel.find()
    .then((pastes) => {
      res.status(200).send(pastes);
    })
    .catch((e) => res.status(400).send(e.message));
};
