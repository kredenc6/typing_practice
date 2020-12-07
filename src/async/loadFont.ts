import WebFont from "webfontloader";
import { FontData } from "../types/types";

export default function loadFont(fontData: FontData, setFontData: (value: React.SetStateAction<FontData>) => void) {
  const { fontFamily, fontLocation } = fontData;
  WebFont.load({
    [fontLocation]: {
      families: [fontFamily]
    },
    fontactive: () => {
      setFontData(fontData);
    }
  });
}
