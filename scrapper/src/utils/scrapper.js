const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const PasteModel = require("../db/models/mongo");
const Pastes = require("./pasteClass");
const socketClient = require("socket.io-client");
const baseUrl = "ws://host.docker.internal:8080";
const socket = socketClient(baseUrl);

async function getPastes() {
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

exports.savePastes = async () => {
  try {
    const dbData = await getPastes();
    let newPastes = [];
    for (let paste of dbData) {
      const isNewPaste = await PasteModel.createIfNotExistsByDate(
        paste,
        paste.date
      );
      if (!isNewPaste) {
        break;
      } else {
        newPastes.push(isNewPaste);
      }
    }
    if (!newPastes.length) return console.log("No New Pastes Were Found");
    socket.emit("newPastes", newPastes);
    console.log(`${newPastes.length} new pastes were inserted to database`);
  } catch (e) {
    console.error(e.message);
  }
};
