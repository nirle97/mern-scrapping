const PasteModel = require("../db/models/mongo");

exports.createAnalytics = async (req, res) => {
  try {
    const pastes = await PasteModel.findAllWithSpecificFields([
      "_id",
      "title",
      "sentimentScore",
      "date",
      "content",
    ]);
    let allPastes = [];
    allPastes.push(...pastes);

    // extract paste's hour and sentiment score
    const barChartData = [];
    const pastesData = [...allPastes].map((paste, i) => {
      barChartData.push({
        sentimentScore: paste.sentimentScore
          ? paste.sentimentScore
          : PasteModel.setNewSentiment(paste.content, paste._id),
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
};
