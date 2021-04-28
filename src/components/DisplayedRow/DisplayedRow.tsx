import React, { useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";
import DisplayedSymbol from "../DisplayedSymbol/DisplayedSymbol";
import TextCursor from "../TextCursor/TextCursor";
import { getRelativePosition, getSymbolStyle } from "./helpFunctions";
import { Row } from "../../textFunctions/transformTextToSymbolRows";
import { FontSize, NewTextDisplayTheme } from "../../types/types";
import InvalidSymbol from "../TextDisplay/InvalidSymbol/InvalidSymbol";
import DisplayedSymbolWrapper from "../DisplayedSymbolWrapper/DisplayedSymbolWrapper";

interface Props extends React.HTMLProps<HTMLDivElement> {
  fontSize: FontSize;
  row: Row;
  setRowHeight?: React.Dispatch<React.SetStateAction<string>>;
  textPosition: number;
  theme: NewTextDisplayTheme;
  enteredSymbol: string;
}

const useStyles = makeStyles({
  row: {
    whiteSpace: "nowrap",
    transition: "margin-top 500ms"
  }
});

export default function DisplayedRow({
  className,
  fontSize,
  row: { words },
  setRowHeight,
  textPosition,
  theme,
  enteredSymbol,
  ...divProps
}: Props) {
  const classes = useStyles();
  const divRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);

  useLayoutEffect(() => {
    if(divRef.current && setRowHeight) {
        const rowHeight = getComputedStyle(divRef.current!).height;
        setRowHeight(rowHeight);
    }
  })

  const DisplayedSymbolWrapperComponents = words.map(({ symbols: wordInSymbols }) => {
    return wordInSymbols.map(({ symbol, symbolPosition, wasCorrect }) => {
      const relativePosition = getRelativePosition(textPosition, symbolPosition);

      const InvalidSymbolComponent =
        enteredSymbol && enteredSymbol !== symbol && relativePosition === "active" ?
        <InvalidSymbol
          symbol={enteredSymbol}
          symbolStyle={getSymbolStyle(false, "processed", theme)} />
        :
        null;

        const DisplayedSymbolComponent = 
          <DisplayedSymbol
            symbolStyle={getSymbolStyle(wasCorrect, relativePosition, theme)}
            symbol={symbol} />;
      return (
        <DisplayedSymbolWrapper
          key={symbolPosition}
          symbolStyle={getSymbolStyle(wasCorrect, relativePosition, theme)} // for memo
          DisplayedSymbol={DisplayedSymbolComponent}
          TextCursor={relativePosition === "active" ? <TextCursor height={fontSize === "20px" ? "2px" : "3px"} /> : null}
          InvalidSymbol={InvalidSymbolComponent} />
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
