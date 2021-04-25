import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { SymbolStyle } from "../../types/types";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import FadeAway from "../transitions/FadeAway/FadeAway";

interface Props {
  symbolStyle: SymbolStyle;
  symbol: string;
  TextCursor: JSX.Element | null;
  InvalidSymbol: JSX.Element | null;
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
  },
  invalidSymbol: {
    position: "absolute",
    top: 0,
    left: 0
  }
});

const DisplayedSymbol = ({ symbol, symbolStyle, TextCursor, InvalidSymbol }: Props) => {
  const classes = useStyles(symbolStyle);
  const [displayInvalid, setDisplayInvalid] = useState(false);
  const timeoutIdRef = useRef(-1);

  useEffect(() => {
    if(InvalidSymbol) {
      setDisplayInvalid(true);
      timeoutIdRef.current = window.setTimeout(() => setDisplayInvalid(false), 50);
    }

    return () => clearTimeout(timeoutIdRef.current);
  },[InvalidSymbol])

  return (
    <span className={classes.textSymbol}>
      {symbol}
      {TextCursor}
      <FadeAway inProp={displayInvalid} className={classes.invalidSymbol}>
        {InvalidSymbol}
      </FadeAway>
    </span>
  );
};

const isEqual = (prevProps: Props, nextProps: Props) => {
  if(!areObjectValuesSame(prevProps.symbolStyle, nextProps.symbolStyle)) {
    return false;
  }
  if(prevProps.TextCursor && nextProps.TextCursor) {
    if (prevProps.TextCursor.props.height !== nextProps.TextCursor.props.height) { // TextCursor height change
      return false;
    }
  }
  if(nextProps.InvalidSymbol) {
    return false;
  }

  return true;
};

export default React.memo(DisplayedSymbol, isEqual);
