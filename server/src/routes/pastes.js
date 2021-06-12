const pastes = require("express").Router();
const pastesController = require("../controllers/pastesController");

pastes.get("/", pastesController.getPastes);

module.exports = pastes;
