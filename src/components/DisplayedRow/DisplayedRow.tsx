import React from "react";
import DisplayedSymbol from "../DisplayedSymbol/DisplayedSymbol";
import { Row } from "../../textFunctions/transformTextToSymbolRows";
import { SymbolStyle, RelativePosition, TextDisplayTheme } from "../../types/types";

interface Props {
  row: Row;
  textPosition: number;
  theme: TextDisplayTheme;
}

export default function DisplayedRow({ row: { words }, textPosition, theme }: Props) {
  const DisplayedSymbolsComponents = words.map(({ symbols: wordInSymbols }) => {
    return wordInSymbols.map(({ symbol, symbolPosition, wasCorrect }) => {
      const relativePosition = getRelativePosition(textPosition, symbolPosition);
      return (
        <DisplayedSymbol
          key={symbolPosition}
          symbolStyle={getSymbolStyle(wasCorrect, relativePosition, theme)}
          symbol={symbol} />
      );
    });
});

  return (
    <pre>{DisplayedSymbolsComponents}</pre>
  );
}

function getRelativePosition(textPosition: number, symbolPosition: number): RelativePosition {
  if(textPosition === symbolPosition) return "active";
  if(textPosition < symbolPosition) return "pending";
  return "processed";
}

function getSymbolStyle(wasCorrect: boolean, relativePosition: RelativePosition, { offset, palette }: TextDisplayTheme): SymbolStyle {
  const symbolStyle: SymbolStyle = {
    borderBottomColor: "transparent",
    bgcColor: palette.text.default.bgcColor,
    color: palette.text.default.color,
    symbolOffset: offset["text"]
  };

  if(relativePosition === "processed") {
    if(wasCorrect) {
      symbolStyle.bgcColor = palette.text.correct.bgcColor;
      symbolStyle.color = palette.text.correct.color;
    } else {
      symbolStyle.bgcColor = palette.text.mistyped.bgcColor;
      symbolStyle.color = palette.text.mistyped.color;
    }
  } else if(relativePosition === "active") {
    symbolStyle.borderBottomColor = palette.cursorColor;
  } 
  
  return symbolStyle;
}
