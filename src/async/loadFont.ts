import WebFont from "webfontloader";
import { type FontData } from "../types/themeTypes";

export default function loadFont(
  fontData: FontData,
  setFontData: (value: React.SetStateAction<FontData>) => void,
  callback?: () => void
) {
  const { fontFamily, fontLocation } = fontData;
  WebFont.load({
    [fontLocation]: {
      families: [fontFamily]
    },
    fontactive: () => {
      setFontData(fontData);
      if(callback) {
        callback();
      }
    }
  });
}
