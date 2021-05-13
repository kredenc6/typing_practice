import React from "react";
import DisplayedSymbol from "../../DisplayedSymbol/DisplayedSymbol";
import { WordObject } from "../../../types/symbolTypes";
import { getSymbolStyle } from "../../DisplayedRow/helpFunctions";
import { TextDisplayTheme } from "../../../types/themeTypes";

interface Props {
  mistypedWord: WordObject;
  textDisplayTheme: TextDisplayTheme;
}

export default function MistypedWord({ mistypedWord, textDisplayTheme }: Props) {
  return (
    <div>
      {mistypedWord.symbols.map(({ symbol, correctness }, i) => {
          const symbolStyle = getSymbolStyle(correctness, "processed", textDisplayTheme);
          return <DisplayedSymbol key={i} symbol={symbol} symbolStyle={symbolStyle} />;
      })}
    </div>
  );
}
