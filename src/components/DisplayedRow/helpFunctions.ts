import { SymbolStyle, TextDisplayTheme } from "../../types/themeTypes";
import { SymbolCorrectness, RelativeSymbolPosition } from "../../types/symbolTypes";

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
  const symbolStyle: SymbolStyle = {
    bgcColor: symbols.default.bgcColor,
    color: symbols.default.color,
    cursorColor: "transparent",
    symbolOffset: offset["symbol"]
  };

  if(relativePosition === "processed") {
    if(correctness === "correct") {
      symbolStyle.bgcColor = symbols.correct.bgcColor;
      symbolStyle.color = symbols.correct.color;
    } else if(correctness === "mistyped") {
      symbolStyle.bgcColor = symbols.mistyped.bgcColor;
      symbolStyle.color = symbols.mistyped.color;
    } else if(correctness === "corrected") {
      symbolStyle.bgcColor = symbols.corrected.bgcColor;
      symbolStyle.color = symbols.corrected.color;
    }
  } else if(relativePosition === "active") {
    symbolStyle.cursorColor = "#0a6bf9";
    symbolStyle.bgcColor = symbols.active.bgcColor;
    symbolStyle.color = symbols.active.color;
  } 
  
  return symbolStyle;
};
