import React from "react";
import { makeStyles } from "@material-ui/core";
import { SymbolStyle } from "../../../types/types";

interface Props {
  symbol: string;
  symbolStyle: SymbolStyle;
}

const useStyles = makeStyles({
  mistypedSymbol: {
    paddingLeft: ({ symbolOffset }: SymbolStyle) => symbolOffset.paddingLeft,
    paddingRight: ({ symbolOffset }: SymbolStyle) => symbolOffset.paddingRight,
    color: ({ color }: SymbolStyle) => color,
    backgroundColor: ({ bgcColor }: SymbolStyle) => bgcColor,
    borderRadius: "3px"
  }
});

export default function InvalidSymbol({ symbol, symbolStyle }: Props) {
  const classes = useStyles(symbolStyle);

  return (
    <span className={classes.mistypedSymbol}>{symbol}</span>
  );
}
