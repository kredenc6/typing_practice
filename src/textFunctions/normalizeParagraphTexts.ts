import adjustTextFromWiki from "./adjustTextFromWiki";
import adjustTextForCzechKeyboard from "./adjustTextForCzechKeyboard";
import adjustTextGeneral from "./adjustTextGeneral";

export default function normalizeParagraphTexts(
  paragraphs: string[]
) {
  return Promise.all(paragraphs.map(paragraph => {
    paragraph = adjustTextFromWiki(paragraph);
    paragraph = adjustTextForCzechKeyboard(paragraph);
    return adjustTextGeneral(paragraph);
  }));
}
