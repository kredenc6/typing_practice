import React, { useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";
import TextCursor from "../TextCursor/TextCursor";
import { getRelativePosition, getSymbolStyle } from "./helpFunctions";
import { WordObject } from "../../types/symbolTypes";
import { FontSize, TextDisplayTheme, AnimateMistyped } from "../../types/themeTypes";
import DisplayedSymbolWrapper from "../DisplayedSymbolWrapper/DisplayedSymbolWrapper";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";

interface Props extends React.HTMLProps<HTMLDivElement> {
  fontSize: FontSize;
  words: WordObject[];
  setRowHeight: React.Dispatch<React.SetStateAction<number>>;
  shouldSetRowHeight: boolean;
  textPosition: number;
  theme: TextDisplayTheme;
  enteredSymbol: string;
  animateMistypedSymbol: AnimateMistyped | null;
  setAnimateMistypedSymbol: React.Dispatch<React.SetStateAction<AnimateMistyped | null>>
}

const useStyles = makeStyles(({ transitions }) => ({
  row: {
    whiteSpace: "nowrap",
    transition: `margin-top ${transitions.duration.complex}ms,
                 padding-bottom ${transitions.duration.complex}ms`
  }
}));

export default function DisplayedRow({
  className,
  fontSize,
  words,
  setRowHeight,
  shouldSetRowHeight,
  textPosition,
  theme,
  enteredSymbol,
  animateMistypedSymbol,
  setAnimateMistypedSymbol,
  ...divProps
}: Props) {
  const classes = useStyles();
  const divRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);

  useLayoutEffect(() => {
    if(divRef.current && shouldSetRowHeight) {
        const rowHeight = getComputedStyle(divRef.current!).height;
        setRowHeight(transformPixelSizeToNumber(rowHeight));
    }
  })

  const DisplayedSymbolWrapperComponents = words.map(({ symbols: wordInSymbols }) => {
    return wordInSymbols.map(({ symbol, symbolPosition, correctness }) => {
      const relativePosition = getRelativePosition(textPosition, symbolPosition);
      const symbolStyle = getSymbolStyle(correctness, relativePosition, theme);

      return (
        <DisplayedSymbolWrapper
          key={symbolPosition}
          symbolStyle={symbolStyle} // for memo
          symbol={symbol}
          // TextCursor={relativePosition === "active" ? <TextCursor height={fontSize === "20px" ? "2px" : "3px"} /> : null}
          textCursorHeight={
            relativePosition === "active"
              ? fontSize === "20px" ? "2px" : "3px"
              : null
          }
          setAnimateMistypedSymbol={setAnimateMistypedSymbol}
          symbolPosition={symbolPosition}
          animateMistypedSymbol={animateMistypedSymbol} />
      );
    });
  });

  return (
    <div
      className={classNames(classes.row, className)} {...divProps}
      ref={divRef}
    >
      {DisplayedSymbolWrapperComponents}
    </div>
  );
};
