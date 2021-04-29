import WebFont from "webfontloader";
import { FontData } from "../types/themeTypes";

export default function loadFont(
  fontData: FontData,
  setFontData: (value: React.SetStateAction<FontData>) => void,
  callback?: () => any
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
