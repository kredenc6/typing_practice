import React from "react";
import { makeStyles } from "@material-ui/core";
import { SymbolStyle } from "../../types/themeTypes";

interface Props {
  symbolStyle: SymbolStyle;
  symbol: string;
}

const useStyles = makeStyles({
  textSymbol: {
    position: "relative",
    marginRight: ({ symbolOffset }: SymbolStyle) => symbolOffset.marginRight,
    paddingLeft: ({ symbolOffset }: SymbolStyle) => symbolOffset.paddingLeft,
    paddingRight: ({ symbolOffset }: SymbolStyle) => symbolOffset.paddingRight,
    color: ({ color }: SymbolStyle) => color,
    backgroundColor: ({ bgcColor }: SymbolStyle) => bgcColor,
    borderRadius: "3px"
  }
});

export default function DisplayedSymbol({ symbol, symbolStyle }: Props) {
  const classes = useStyles(symbolStyle);

  return (
    <span className={classes.textSymbol}>
      {symbol}
    </span>
  );
};
