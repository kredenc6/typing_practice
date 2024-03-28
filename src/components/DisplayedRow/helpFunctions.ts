import { type SymbolStyle, type TextDisplayTheme } from "../../types/themeTypes";
import { type SymbolCorrectness, type RelativeSymbolPosition } from "../../types/symbolTypes";

export const getRelativePosition = (textPosition: number, symbolPosition: number): RelativeSymbolPosition => {
  if(textPosition === symbolPosition) return "active";
  if(textPosition < symbolPosition) return "pending";
  return "processed";
};

export const getSymbolStyle = (
  correctness: SymbolCorrectness,
  relativePosition: RelativeSymbolPosition,
  { offset, symbols }: TextDisplayTheme
): SymbolStyle => {
  let symbolStyle: SymbolStyle = {
    backgroundColor: symbols.pending.backgroundColor,
    color: symbols.pending.color,
    cursorColor: "transparent",
    symbolOffset: offset["symbol"]
  };
  
  if(relativePosition === "processed") {
    symbolStyle = { ...symbolStyle, ...symbols[correctness] }
  } else if(relativePosition === "active") {
    symbolStyle.cursorColor = "#0a6bf9";
    symbolStyle.backgroundColor = symbols.active.backgroundColor;
    symbolStyle.color = symbols.active.color;
  }
  
  return symbolStyle;
};
