import { FontFamily, FontSize, FontData } from "../types/themeTypes";

export default function getFontData(fontFamily: FontFamily, fontSize: FontSize): Promise<FontData | null> {
  return fetch(`./fontData/${fontFamily} ${fontSize}.json`)
    .then(response => response.json())
    .catch(err => {
      console.log(err.message);
      return null;
    });
}
