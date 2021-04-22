import normalizeTextGeneral from "./normalizeTextGeneral";
import normalizeTextFromWiki from "./normalizeTextFromWiki";
import normalizeTextForCzechKeyboard from "./normalizeTextForCzechKeyboard";

export default async function normalizeText(
  textInput: string,
  wikiNormalize: boolean,
  czechKeyboardNormalize: boolean
) {
  let normalizedText = textInput;
  
  if(wikiNormalize) {
    normalizedText = normalizeTextFromWiki(normalizedText);
  }
  if(czechKeyboardNormalize) {
    normalizedText = normalizeTextForCzechKeyboard(normalizedText);
  }
  return await normalizeTextGeneral(normalizedText);
};
