const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const PasteModel = require("./mongo");
const schedule = require("node-schedule");
const mongoose = require("mongoose");
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
class Pastes {
  getTitles(page) {
    const titles = [];
    page("h4").each((i, elem) => {
      const title = page(elem).text().replace(/\s\s+/g, "");
      titles.push(title);
    });
    return titles;
  }
  getContents(page) {
    const contents = [];
    page(".row div.well ol").each((i, elem) => {
      contents.push(page(elem));
    });
    const listOfLines = contents.map((list) => {
      let listText = "";
      page(list).each((i, li) => {
        const line = page(li).text().replace(/\s\s+/g, "");
        listText = line;
      });
      contents.push(listText);
      return listText;
    });
    return listOfLines;
  }
  getAuthors(page) {
    const authors = [];
    page(".pre-info").each((i, elem) => {
      let info = page(elem).text().replace(/\s\s+/g, "");
      if (info.includes("Posted by")) {
        let author = info.substring(
          info.indexOf("Posted") + 10,
          info.indexOf("at")
        );
        authors.push(author);
      }
    });
    return authors;
  }

  getDates(page) {
    const dates = [];
    page(".pre-info").each((i, elem) => {
      let info = page(elem).text().replace(/\s\s+/g, "");
      if (info.includes("Posted by")) {
        let divDate = info.substring(
          info.indexOf("at") + 3,
          info.lastIndexOf("UTC") - 1
        );
        dates.push(divDate);
      }
    });
    return dates;
  }
}

const getPastes = async () => {
  try {
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
    const dbData = await scrapePage(page);
    browser.close();
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
          console.log("breaking out of the loop");
          break;
        }
        PasteModel.exists({ date: paste.date }, function (e, exists) {
          if (e) {
            console.error(e.message);
          } else {
            if (!exists) {
              PasteModel.insertOne(paste)
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
  getPastes();
});

async function scrapePage(page) {
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
  return dbData;
}
