import normalizeTextGeneral from "../../textFunctions/normalizeText";
import normalizeTextFromWiki from "../../textFunctions/normalizeTextFromWiki";
import normalizeTextForCzechKeyboard from "../../textFunctions/normalizeTextForCzechKeyboard";

export const  normalizeText = async (textInput: string, wikiNormalize: boolean, czechKeyboardNormalize: boolean) => {
  let normalizedText = textInput;
  
  if(wikiNormalize) {
    normalizedText = normalizeTextFromWiki(normalizedText);
  }
  if(czechKeyboardNormalize) {
    normalizedText = normalizeTextForCzechKeyboard(normalizedText);
  }
  return await normalizeTextGeneral(normalizedText);
};