import { FontFamily, FontSize, FontSymbolData } from "../types/types";

export default function getFontData(fontFamily: FontFamily, fontSize: FontSize): Promise<FontSymbolData | null> {
  return fetch(`./fontData/${fontFamily} ${fontSize}.json`)
    .then(response => response.json())
    .catch(err => {
      console.log(err.message);
      return null;
    });
}
