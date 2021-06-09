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
  createdAt: { type: Date, default: Date.now, index: { expires: 86400 } },
});

const PasteModel = mongoose.model("PasteModel", pastesSchema);
module.exports = PasteModel;
