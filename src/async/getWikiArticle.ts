export default function getWikiArticle(relativePath: string) {
  return fetch(`/.netlify/functions/proxy/${relativePath}`)
    .then(response => response.text())
    .then(html => html)
    .catch(err => {
      console.log(err.message);
      return "";
    });
}

// export const getWikiArticleOfTheWeek = () => {
//   return fetch("/.netlify/functions/proxy/wikiArticleOfTheWeek")
//     .then(response => response.text())
//     .then(html => html)
//     .catch(err => {
//       console.log(err.message);
//       return "";
//     });
// }
