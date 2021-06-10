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

const createIfNotExistsByDate = async (document, documentDate) => {
  PasteModel.exists({ date: documentDate }, function (err, exists) {
    if (err) return console.error(err.message);
    if (!exists) {
      PasteModel.create(document)
        .then(() => console.log("paste added to mongodb"))
        .catch((e) => console.error(e.message));
    } else {
      return false;
    }
  });
};
module.exports = { PasteModel, createIfNotExistsByDate };
