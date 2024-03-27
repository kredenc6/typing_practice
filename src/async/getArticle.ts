// TODO don't handle the error here

export default function getArticle(relativePath: string) {
  return fetch(`/.netlify/functions/proxy/${relativePath}`)
    .then(response => response.text())
    .then(html => html)
    .catch(err => {
      console.log(err.message);
      return "";
    });
}
