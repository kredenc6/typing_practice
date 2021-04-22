import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/randomWiki", (_, res) => {
  axios({
    method: "GET",
    responseType: "text",
    url: "https://cs.wikipedia.org/wiki/Speci%C3%A1ln%C3%AD:N%C3%A1hodn%C3%A1_str%C3%A1nka"
  })
    .then(({ data: rawHtml }) => res.send(rawHtml))
    .catch(err => res.send(paragraphError(err)));
});

router.get("/wikiArticleOfTheWeek", async (_, res) => {
  try {
    const rawHtmlWithLink = await getHtmlWithArticleOfTheWeekLink();
    const link = extractLinkOfTheWikiArticleOfTheWeek(rawHtmlWithLink);

    axios({
      method: "GET",
      responseType: "text",
      url: `https://cs.wikipedia.org/${link}`
    })
      .then(({ data: rawHtml }) => res.send(rawHtml));
  } catch(err) {
    res.send(paragraphError(err));
  }
});


export default router;

/** @returns relative path for https://cs.wikipedia.org  */
function extractLinkOfTheWikiArticleOfTheWeek(html: string) {
  const articleOfTheWeekRegExp = /<b><a href=(".+?").*<\/a><\/b>/g;
  const regexpResult = articleOfTheWeekRegExp.exec(html);
  if(regexpResult) {
    return regexpResult[1] // link is in the second index position
      .slice(1, -1); // get rid of the double quotes
  }
  throw new Error("Regular expression found no link.");
}

function getHtmlWithArticleOfTheWeekLink(): Promise<string> {
  return axios({
    method: "GET",
    responseType: "text",
    url: "https://cs.wikipedia.org/wiki/Wikipedie:%C4%8Cl%C3%A1nek_t%C3%BDdne"
  })
    .then(({ data: rawHtml }) => rawHtml)
    .catch(err => {
      throw new Error(`Failed to get html with article of the week link: ${err.message}`);
    });
}

function paragraphError(error: any) {
  return `<p>${error.message}</p>`;
}