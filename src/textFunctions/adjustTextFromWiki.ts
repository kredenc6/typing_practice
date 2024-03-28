const SQUARE_BRACKETS_LINKS_REGEXP = /\[.*?]/g;

export default function adjustTextFromWiki(text: string) {
  return text
    .replace(SQUARE_BRACKETS_LINKS_REGEXP, "")
    .replace(/ ?– ?/g, " - ") // long dash
    .replace(/[„“]/g, '"');
}
