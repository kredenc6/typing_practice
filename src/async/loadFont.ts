import WebFont from "webfontloader";
import { type FontData } from "../types/themeTypes";

export default function loadFont( fontData: FontData, callback?: () => any ) {
  const { fontFamily, fontLocation } = fontData;
  
  WebFont.load({
    [fontLocation]: {
      families: [fontFamily]
    },
    fontactive: () => {
      if(callback) {
        callback();
      }
    }
  });
}
