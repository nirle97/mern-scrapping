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
  try {
    const count = await PasteModel.countDocuments({ date: docDate });
    if (count === 0) {
      return await PasteModel.create(doc);
    } else {
      return false;
    }
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = { PasteModel, createIfNotExistsByDate };
