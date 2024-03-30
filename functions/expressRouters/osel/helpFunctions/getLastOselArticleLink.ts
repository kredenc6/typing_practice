import axios from "axios";

export default async function getLastOselArticleLink() {
  const rawHtmlWithLink = await getHtmlWithLastOselArticleLink();
  return extractLinkOfTheLastOselArticle(rawHtmlWithLink);
}

function extractLinkOfTheLastOselArticle(html: string) {
  const articleLinksRegExp = /'nadpis_clanku'><a href=(".*")/g;
  const regExpResult = articleLinksRegExp.exec(html);
  if(regExpResult) {
    return regExpResult[1] // needed link is in the second array position
      .slice(1, -1); // get rid of double quotes
  }
  throw new Error("Regular expression found no link.");
}

function getHtmlWithLastOselArticleLink(): Promise<string> {
  return axios({
    method: "GET",
    responseType: "text",
    url: "http://www.osel.cz"
  })
    .then(({ data: rawHtml }) => rawHtml)
    .catch(err => {
      throw new Error(`Failed to get html with last osel article link: ${err.message}`);
    });
}
