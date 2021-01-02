import React, { useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";
import DisplayedSymbol from "../DisplayedSymbol/DisplayedSymbol";
import TextCursor from "../TextCursor/TextCursor";
import { getRelativePosition, getSymbolStyle } from "./helpFunctions";
import { Row } from "../../textFunctions/transformTextToSymbolRows";
import { FontSize, TextDisplayTheme } from "../../types/types";

interface Props extends React.HTMLProps<HTMLPreElement> {
  fontSize: FontSize;
  row: Row;
  setRowHeight?: React.Dispatch<React.SetStateAction<string>>;
  textPosition: number;
  theme: TextDisplayTheme;
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
    <pre
      className={classNames(classes.row, className)} {...preProps}
      ref={preRef}
    >
      {DisplayedSymbolsComponents}
    </pre>
  );
};
