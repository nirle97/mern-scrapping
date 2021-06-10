const pastes = require("express").Router();
const pastesController = require("../controllers/pastesController");

pastes.get("/", pastesController.getPastes);

// pastes.post("/new-scrape/:amount", (req, res) => {
//   const newPastes = req.params.amount;
// });

module.exports = pastes;
