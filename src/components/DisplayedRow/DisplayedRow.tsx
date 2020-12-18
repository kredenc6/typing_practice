import React from "react";
import DisplayedSymbol from "../DisplayedSymbol/DisplayedSymbol";
import TextCursor from "../TextCursor/TextCursor";
import { Row } from "../../textFunctions/transformTextToSymbolRows";
import { FontSize, SymbolStyle, RelativeSymbolPosition, TextDisplayTheme } from "../../types/types";

interface Props {
  fontSize: FontSize;
  row: Row;
  textPosition: number;
  theme: TextDisplayTheme;
}

export default function DisplayedRow({ fontSize, row: { words }, textPosition, theme }: Props) {
  const DisplayedSymbolsComponents = words.map(({ symbols: wordInSymbols }) => {
    return wordInSymbols.map(({ symbol, symbolPosition, wasCorrect }) => {
      const relativePosition = getRelativePosition(textPosition, symbolPosition);
      return (
        <DisplayedSymbol
          key={symbolPosition}
          TextCursor={relativePosition === "active" ? <TextCursor height={fontSize === "20px" ? "2px" : "3px"} /> : null}
          symbolStyle={getSymbolStyle(wasCorrect, relativePosition, theme)}
          symbol={symbol} />
      );
    });
});

  return (
    <pre>{DisplayedSymbolsComponents}</pre>
  );
}

function getRelativePosition(textPosition: number, symbolPosition: number): RelativeSymbolPosition {
  if(textPosition === symbolPosition) return "active";
  if(textPosition < symbolPosition) return "pending";
  return "processed";
}

function getSymbolStyle(wasCorrect: boolean, relativePosition: RelativeSymbolPosition, { offset, palette }: TextDisplayTheme): SymbolStyle {
  const symbolStyle: SymbolStyle = {
    bgcColor: palette.symbols.default.bgcColor,
    color: palette.symbols.default.color,
    cursorColor: "transparent",
    symbolOffset: offset["text"]
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
}
