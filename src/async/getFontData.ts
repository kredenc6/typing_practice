import { type FontFamily, type FontSize, type FontData } from "../types/themeTypes";

export default function getFontData(fontFamily: FontFamily, fontSize: FontSize): Promise<FontData> {
  return fetch(`./fontData/${fontFamily} ${fontSize}.json`)
    .then(response => response.json())
}
