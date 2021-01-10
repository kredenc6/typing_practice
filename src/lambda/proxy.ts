import express from "express";
import serverless from "serverless-http";
import axios from "axios";

const app = express();
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

app.use("/.netlify/functions/proxy", router);

export const handler = serverless(app);

/** @returns relative path for https://cs.wikipedia.org or empty string on failure  */
function extractLinkOfTheWikiArticleOfTheWeek(html: string) {
  const articleOfTheWeekRegExp = /<b><a href=(".+?").*<\/a><\/b>/g;
  const regexpResult = articleOfTheWeekRegExp.exec(html);
  if(regexpResult) {
    console.log(`relative link: ${regexpResult[1].slice(1, -1)}`)
    return regexpResult[1].slice(1, -1); // link should be in the second position in double quotes
  }
  console.log("No link extracted!");
  return "";
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