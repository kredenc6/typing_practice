import { FontFamily, FontSize, FontData } from "../types/themeTypes";

export default function getFontData(fontFamily: FontFamily, fontSize: FontSize): Promise<FontData> {
  return fetch(`./fontData/${fontFamily} ${fontSize}.json`)
    .then(response => response.json())
}
