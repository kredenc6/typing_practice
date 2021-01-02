import { SymbolStyle, RelativeSymbolPosition, TextDisplayTheme } from "../../types/types";

export const getRelativePosition = (textPosition: number, symbolPosition: number): RelativeSymbolPosition => {
  if(textPosition === symbolPosition) return "active";
  if(textPosition < symbolPosition) return "pending";
  return "processed";
};

export const getSymbolStyle = (
  wasCorrect: boolean,
  relativePosition: RelativeSymbolPosition,
  { offset, palette }: TextDisplayTheme
): SymbolStyle => {
  const symbolStyle: SymbolStyle = {
    bgcColor: palette.symbols.default.bgcColor,
    color: palette.symbols.default.color,
    cursorColor: "transparent",
    symbolOffset: offset["symbol"]
  };

  if(relativePosition === "processed") {
    if(wasCorrect) {
      symbolStyle.bgcColor = palette.symbols.correct.bgcColor;
      symbolStyle.color = palette.symbols.correct.color;
    } else {
      symbolStyle.bgcColor = palette.symbols.mistyped.bgcColor;
      symbolStyle.color = palette.symbols.mistyped.color;
    }
  } else if(relativePosition === "active") {
    symbolStyle.cursorColor = "#0a6bf9";
    symbolStyle.bgcColor = palette.symbols.active.bgcColor;
    symbolStyle.color = palette.symbols.active.color;
  } 
  
  return symbolStyle;
};
