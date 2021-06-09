module.exports = class Pastes {
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
};
