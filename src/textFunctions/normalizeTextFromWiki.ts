const SQUARE_BRACKETS_LINKS_REGEXP = /\[.*?]/g;

export default function normalizeTextFromWiki(text: string) {
  return text
    .replaceAll(SQUARE_BRACKETS_LINKS_REGEXP, "")
    .replaceAll(/ ?– ?/g, " - ") // long dash
    .replaceAll(/[„“]/g, '"');
}
