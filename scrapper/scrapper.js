const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const PasteModel = require("./src/mongo");
const Pastes = require("./src/pasteClass");
const schedule = require("node-schedule");
const mongoose = require("mongoose");
const socketClient = require("socket.io-client");
const baseUrl = "http://localhost:8080";
let firstTime = true;

mongoose
  .connect("mongodb://mongodb:27017/pastes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`scrapper connected to MongoDB`);
  })
  .catch((error) => {
    console.log("error connecting scrapper to MongoDB:", error.message);
  });

async function scrapePage() {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: [
      "--proxy-server=socks5://host.docker.internal:9050",
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--link scrape-network:scrape-network",
    ],
  });
  const page = await browser.newPage();
  const data = new Pastes();
  const dbData = [];
  let pageNumber = 1;
  let i = 0;
  while (i < 200) {
    await page.goto(`http://nzxj65x32vh2fkhk.onion/all?page=${pageNumber}`, {
      waitUntil: "load",
      timeout: 0,
    });
    const html = await page.content();
    const $ = cheerio.load(html);
    const contents = data.getContents($);
    if (!contents.length) break;
    const titles = data.getTitles($);
    const authors = data.getAuthors($);
    const dates = data.getDates($);
    for (let i = 0; i < titles.length; i++) {
      const paste = {
        title: titles[i],
        content: contents[i],
        author: authors[i],
        date: dates[i],
        createdAt: new Date(dates[i]).getTime(),
      };
      dbData.push(paste);
    }
    pageNumber++;
  }
  browser.close();
  return dbData;
}

const savePastes = async () => {
  try {
    const dbData = await scrapePage();
    if (firstTime) {
      PasteModel.insertMany(dbData)
        .then(() => {
          firstTime = false;
          console.log("data inserted to mongodb");
        })
        .catch((e) => console.error(e.message));
    } else {
      let breakLoop = false;
      for (let paste of dbData) {
        if (breakLoop) {
          break;
        }
        PasteModel.exists({ date: paste.date }, function (err, exists) {
          if (err) {
            console.error(err.message);
          } else {
            if (!exists) {
              PasteModel.create(paste)
                .then(() => console.log("one paste was added to mongodb"))
                .catch((e) => console.error(e.message));
            } else {
              breakLoop = true;
            }
          }
        });
      }
    }
  } catch (e) {
    console.error(e.message);
  }
};

schedule.scheduleJob("*/120 * * * * *", function () {
  console.log("Gathering Pastes..");
  savePastes();
});
