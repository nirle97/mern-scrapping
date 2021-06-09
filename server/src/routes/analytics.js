const Sentiment = require("sentiment");
const sentiment = new Sentiment();
const PasteModel = require("../mongo");
const { Router } = require("express");
const analytics = Router();

function setNewSentiment(text, pasteId) {
  const score = sentiment.analyze(text).score;
  PasteModel.findByIdAndUpdate(
    { _id: pasteId },
    {
      sentimentScore: score,
    }
  );
  return score;
}

analytics.get("/", async (req, res) => {
  try {
    let allPastes = [];
    const pastes = await PasteModel.find({}).select({
      _id: 1,
      title: 1,
      sentimentScore: 1,
      date: 1,
      content: 1,
    });
    allPastes.push(...pastes);
    // extract paste's hour and sentiment score
    const barChartData = [];
    const pastesData = [...allPastes].map((paste, i) => {
      barChartData.push({
        sentimentScore: paste.sentimentScore
          ? paste.sentimentScore
          : setNewSentiment(paste.content, paste._id),
        title: paste.title,
        number: i + 1,
      });
      return {
        hour: new Date(paste.date).getHours(),
      };
    });
    let counts = {};
    //create obj of { paste: hour }
    for (let i = 0; i < pastesData.length; i++) {
      if (counts[pastesData[i].hour]) {
        counts[pastesData[i].hour] += 1;
      } else {
        counts[pastesData[i].hour] = 1;
      }
    }
    //create array of { paste: x, hour: y }
    const timeChartData = [];
    for (let key of Object.keys(counts)) {
      timeChartData.push({
        hour: `${key}:00`,
        pastes: counts[key],
      });
    }

    res.status(200).send({ timeChartData, barChartData });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = analytics;
