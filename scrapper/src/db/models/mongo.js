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

const createIfNotExistsByDate = async (doc, docDate) => {
  return PasteModel.countDocuments({ date: docDate }, (err, count) => {
    if (err) return console.error(err.message);
    if (count === 0) {
      PasteModel.create(doc)
        .then(() => console.log("paste added to mongodb"))
        .catch((e) => console.error(e.message));
    } else {
      return true;
    }
  });
};
module.exports = { PasteModel, createIfNotExistsByDate };
