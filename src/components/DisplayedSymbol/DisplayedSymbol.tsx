import React from "react";
import { makeStyles } from "@material-ui/core";
import { SymbolStyle } from "../../types/types";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";

interface Props {
  symbolStyle: SymbolStyle;
  symbol: string;
  TextCursor: JSX.Element | null;
}

const useStyles = makeStyles({
  textSymbol: {
    position: "relative",
    marginRight: ({ symbolOffset }: SymbolStyle) => symbolOffset.marginRight,
    padding: ({ symbolOffset }: SymbolStyle) => symbolOffset.padding,
    color: ({ color }: SymbolStyle) => color,
    backgroundColor: ({ bgcColor }: SymbolStyle) => bgcColor,
    borderRadius: "3px"
  }
});

const DisplayedSymbol = ({ symbol, symbolStyle, TextCursor }: Props) => {
  const styles = useStyles(symbolStyle);
  return (
    <span className={styles.textSymbol}>{symbol}{TextCursor}</span>
  );
};

const compareForRender = (prevProps: Props, nextProps: Props) => {
  if(!areObjectValuesSame(prevProps.symbolStyle, nextProps.symbolStyle)) {
    return false;
  }
  return true;
};

export default React.memo(DisplayedSymbol, compareForRender);
