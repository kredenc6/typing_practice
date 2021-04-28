import { SymbolStyle, RelativeSymbolPosition, TextDisplayTheme } from "../../types/types";

export const getRelativePosition = (textPosition: number, symbolPosition: number): RelativeSymbolPosition => {
  if(textPosition === symbolPosition) return "active";
  if(textPosition < symbolPosition) return "pending";
  return "processed";
};

export const getSymbolStyle = (
  wasCorrect: boolean,
  relativePosition: RelativeSymbolPosition,
  { offset, symbols }: TextDisplayTheme
): SymbolStyle => {
  const symbolStyle: SymbolStyle = {
    bgcColor: symbols.default.bgcColor,
    color: symbols.default.color,
    cursorColor: "transparent",
    symbolOffset: offset["symbol"]
  };

  if(relativePosition === "processed") {
    if(wasCorrect) {
      symbolStyle.bgcColor = symbols.correct.bgcColor;
      symbolStyle.color = symbols.correct.color;
    } else {
      symbolStyle.bgcColor = symbols.mistyped.bgcColor;
      symbolStyle.color = symbols.mistyped.color;
    }
  } else if(relativePosition === "active") {
    symbolStyle.cursorColor = "#0a6bf9";
    symbolStyle.bgcColor = symbols.active.bgcColor;
    symbolStyle.color = symbols.active.color;
  } 
  
  return symbolStyle;
};
