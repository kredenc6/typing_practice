import normalizeText from "./normalizeText";

export default function normalizeParagraphTexts(
  paragraphs: string[],
  wikiNormalize: boolean,
  czechKeyboardNormalize: boolean
) {
  return Promise.all(paragraphs.map(paragraph => {
    return normalizeText(paragraph, wikiNormalize, czechKeyboardNormalize);
  }));
}
