import getFontData from "../async/getFontData";

const FONT_FAMILY = "Bitter";
const FONT_SIZE = "20px";
const ALLOWED_SPECIAL_CHARS = [" ", "#", '"'];
// take advantage of the symbolWidths object - if the property(matched character) exists return true
const isAllowedChar = (char: string, symbolWidths: { [keyboardChar: string]: number }) => {
  return ALLOWED_SPECIAL_CHARS.includes(char) || (symbolWidths[char] !== undefined);
};

export const getRidOfUnknownCharacters = async (text: string) => {
  const fontData = await getFontData(FONT_FAMILY, FONT_SIZE);
  if(!fontData) return "";

  const { symbolWidths } = fontData;
  const replacer = (match: string) => {
    if(isAllowedChar(match, symbolWidths)) {
      return match;
    }
    return "";
  };

  return text.replace(/[\s\S]{1}/g, replacer);
};

export const normalizeWhitespace = (text: string) => text.trim().replace(/\s+/g, " ");

export default async function normalizeText(text: string) {
  return normalizeWhitespace(
    await getRidOfUnknownCharacters(text)
  );
};
