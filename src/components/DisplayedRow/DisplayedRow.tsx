import React from "react";
import DisplayedSymbol from "../DisplayedSymbol/DisplayedSymbol";
import { Row } from "../../textFunctions/transformTextToSymbolRows";

interface Props {
  row: Row;
  textPosition: number;
}

export default function DisplayedRow({ row: { words }, textPosition }: Props) {
  const DisplayedSymbolsComponents = words.map(({ symbols: wordInSymbols }) =>
    wordInSymbols.map(({ symbol, symbolPosition, wasCorrect }) => 
      <DisplayedSymbol
        key={symbolPosition}
        symbol={symbol}
        relativePosition={textPosition - symbolPosition}
        wasCorrect={wasCorrect} />
    ));

  return (
    <pre>{DisplayedSymbolsComponents}</pre>
  );
}
