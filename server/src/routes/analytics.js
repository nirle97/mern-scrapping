const analyticsController = require("../controllers/analyticsController");
const analytics = require("express").Router();

analytics.get("/", analyticsController.createAnalytics);

module.exports = analytics;
