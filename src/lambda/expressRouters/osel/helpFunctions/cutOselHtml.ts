export default function cutOselText(html: string) {
  const endOfOselText = html.search("<div class='zapati_clanku'>");
  
  if(endOfOselText === -1) {
    console.log("Osel's end of text found no match.");
    return html;
  }
  return html.slice(0, endOfOselText);
}
