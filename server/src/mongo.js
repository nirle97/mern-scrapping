const mongoose = require("mongoose");

const pastesSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  author: {
    type: String,
    default: "Anonymous",
  },
  date: {
    type: String,
  },
  sentimentScore: {
    type: Number,
    default: 0,
  },
});

const PasteModel = mongoose.model("PasteModel", pastesSchema);
module.exports = PasteModel;
