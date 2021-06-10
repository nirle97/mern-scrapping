const Sentiment = require("sentiment");
const sentiment = new Sentiment();

exports.getSentimentScore = (text) => {
  return sentiment.analyze(text).score;
};
