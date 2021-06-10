const mongoose = require("mongoose");
const { getSentimentScore } = require("../../utils/sentiment");
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

const setNewSentiment = (text, pasteId) => {
  const score = getSentimentScore(text);
  PasteModel.findByIdAndUpdate(
    { _id: pasteId },
    {
      sentimentScore: score,
    }
  );
  return score;
};

const findAllWithSpecificFields = ([...fields]) => {
  const selectedFields = {};
  for (field of fields) {
    selectedFields[`${field}`] = 1;
  }
  return PasteModel.find({})
    .select(selectedFields)
    .then((pastes) => pastes)
    .catch((e) => console.error(e.message));
};

module.exports = {
  PasteModel,
  findAllWithSpecificFields,
  setNewSentiment,
};
