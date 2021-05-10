import React from "react";
import DisplayedSymbol from "../../DisplayedSymbol/DisplayedSymbol";
import { WordObject } from "../../../types/symbolTypes";
import { getSymbolStyle } from "../../DisplayedRow/helpFunctions";
import { TextDisplayTheme } from "../../../types/themeTypes";

interface Props {
  // mistypedWord: string; // FOR TESTING
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

// FOR TESTING

// export default function MistypedWord({ mistypedWord, textDisplayTheme }: Props) {
//   return (
//     <div>
//       {mistypedWord.split("").map((symbol, i) => {
//           const symbolStyle = getSymbolStyle("mistyped", "processed", textDisplayTheme);
//           return <DisplayedSymbol key={i} symbol={symbol} symbolStyle={symbolStyle} />;
//       })}
//     </div>
//   );
// }
