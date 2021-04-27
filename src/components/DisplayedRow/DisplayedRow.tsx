import React, { useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import { makeStyles, useTheme } from "@material-ui/core";
import DisplayedSymbol from "../DisplayedSymbol/DisplayedSymbol";
import TextCursor from "../TextCursor/TextCursor";
import { getRelativePosition, getSymbolStyle } from "./helpFunctions";
import { Row } from "../../textFunctions/transformTextToSymbolRows";
import { FontSize, NewTextDisplayTheme } from "../../types/types";
import InvalidSymbol from "../TextDisplay/InvalidSymbol/InvalidSymbol";

interface Props extends React.HTMLProps<HTMLPreElement> {
  fontSize: FontSize;
  row: Row;
  setRowHeight?: React.Dispatch<React.SetStateAction<string>>;
  textPosition: number;
  theme: NewTextDisplayTheme;
  enteredSymbol: string;
}

const useStyles = makeStyles({
  row: {
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
  ...preProps
}: Props) {
  const classes = useStyles();
  const preRef: React.MutableRefObject<null | HTMLPreElement> = useRef(null);

  useLayoutEffect(() => {
    if(preRef.current && setRowHeight) {
        const rowHeight = getComputedStyle(preRef.current!).height;
        setRowHeight(rowHeight);
    }
  })

  const DisplayedSymbolsComponents = words.map(({ symbols: wordInSymbols }) => {
    return wordInSymbols.map(({ symbol, symbolPosition, wasCorrect }) => {
      const relativePosition = getRelativePosition(textPosition, symbolPosition);
      // let invalidSymbol;
      // if(enteredSymbol && enteredSymbol !== symbol && relativePosition === "active") {
      //   invalidSymbol = enteredSymbol;
      // }
      const InvalidSymbolComponent =
        enteredSymbol && enteredSymbol !== symbol && relativePosition === "active" ?
        <InvalidSymbol
          symbol={enteredSymbol}
          symbolStyle={getSymbolStyle(false, "processed", theme)} />
        :
        null;
      return (
        <DisplayedSymbol
          key={symbolPosition}
          TextCursor={relativePosition === "active" ? <TextCursor height={fontSize === "20px" ? "2px" : "3px"} /> : null}
          symbolStyle={getSymbolStyle(wasCorrect, relativePosition, theme)}
          symbol={symbol}
          InvalidSymbol={InvalidSymbolComponent} />
      );
    });
  });

  return (
    <pre
      className={classNames(classes.row, className)} {...preProps}
      ref={preRef}
    >
      {DisplayedSymbolsComponents}
    </pre>
  );
};
