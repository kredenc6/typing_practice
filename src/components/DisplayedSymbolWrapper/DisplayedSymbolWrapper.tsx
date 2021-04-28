import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import FadeAway from "../transitions/FadeAway/FadeAway";
import { SymbolStyle } from "../../types/types";

interface Props {
  DisplayedSymbol: JSX.Element | null;
  TextCursor: JSX.Element | null;
  InvalidSymbol: JSX.Element | null;
  symbolStyle: SymbolStyle; // for memo
}

const useStyles = makeStyles({
  displayedSymbolWrapper: {
    display: "inline-box",
    whiteSpace: "pre"
  },
  symbol: {
    position: "relative",
    
  },
  invalidSymbol: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  }
});

function DisplayedSymbolWrapper(
  { DisplayedSymbol, TextCursor, InvalidSymbol }: Props
) {
  const classes = useStyles();
  const [displayInvalid, setDisplayInvalid] = useState(false);
  const timeoutIdRef = useRef(-1);

  useEffect(() => {
    if(InvalidSymbol) {
      setDisplayInvalid(true);
      timeoutIdRef.current = window.setTimeout(() => setDisplayInvalid(false), 150);
    }

    return () => clearTimeout(timeoutIdRef.current);
  },[InvalidSymbol])

  return(
    <div className={classes.displayedSymbolWrapper}>
      <div className={classes.symbol}>
        {DisplayedSymbol}
        <FadeAway inProp={displayInvalid} className={classes.invalidSymbol}>
          {InvalidSymbol}
        </FadeAway>
        {TextCursor}
      </div>
    </div>
  );
}

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

export default React.memo(DisplayedSymbolWrapper, isEqual);