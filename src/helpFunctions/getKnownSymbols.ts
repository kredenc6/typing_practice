import { type FontData } from "../types/themeTypes";

export const getKnownSymbols = (fontData: FontData) => {
  return Object.keys(fontData.symbolWidths).map(symbol => {
    if(symbol === "space") {
      return " ";
    }
    if(symbol === "doubleQuote") {
      return '"';
    }
    if(symbol === "hash") {
      return "#";
    }
    return symbol;
  });
};
