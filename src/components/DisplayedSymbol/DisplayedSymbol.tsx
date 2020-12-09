import React from "react";
import { makeStyles } from "@material-ui/core";
import { SymbolStyle } from "../../types/types";

interface Props {
  symbolStyle: SymbolStyle;
  symbol: string;
}

const useStyles = makeStyles({
  textSymbol: {
    backgroundColor: ({ bgcColor }: SymbolStyle) => bgcColor,
    borderBottom: ({ borderBottomColor }: SymbolStyle) => `3px solid ${borderBottomColor}`,
    marginRight: ({ symbolOffset }: SymbolStyle) => symbolOffset.marginRight,
    padding: ({ symbolOffset }: SymbolStyle) => symbolOffset.padding,
    color: ({ color }: SymbolStyle) => color
  }
});

const DisplayedSymbol = ({ symbol, symbolStyle }: Props) => {
  const styles = useStyles(symbolStyle);
  return (
    symbol === " " ?
      <span className={styles.textSymbol}> <i></i></span>
      :
      <span className={styles.textSymbol}>{symbol}</span>
  );
};

export default React.memo(DisplayedSymbol);
