import express from "express";
import axios from "axios";
import getLastOselArticleLink from "./helpFunctions/getLastOselArticleLink";
import cutOselHtml from "./helpFunctions/cutOselHtml";

const router = express.Router();

// TODO max historic page number: 195
// TODO filter out links, comments, etc. on the end of the page
// TODO osel articles have &nbsp; after prepositions, which get filtered out

// router.get("/randomOsel", (_, res) => {
//   axios({
//     method: "GET",
//     responseType: "text",
//     url: "https://cs.wikipedia.org/wiki/Speci%C3%A1ln%C3%AD:N%C3%A1hodn%C3%A1_str%C3%A1nka"
//   })
//     .then(({ data: rawHtml }) => res.send(rawHtml))
//     .catch(err => res.send(paragraphError(err)));
// });

router.get("/oselLastArticle", async (_, res) => {
  try {
    const { data: rawOselHtml } = await axios({
      method: "GET",
      responseType: "text",
      url: await getLastOselArticleLink()
    });

    const cutHtml = cutOselHtml(rawOselHtml);
    res.send(cutHtml);
  } catch(err) {
    res.send(paragraphError(err));
  }
});

export default router;

function paragraphError(error: any) {
  return `<p>${error.message}</p>`;
}
