const { PasteModel } = require("../db/models/mongo");

exports.getPastes = async (req, res) => {
  try {
    const pastes = await PasteModel.find();
    res.status(200).send(pastes);
  } catch (e) {
    res.status(400).send(e.message);
  }
};
