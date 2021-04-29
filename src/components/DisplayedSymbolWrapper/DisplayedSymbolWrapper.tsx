import React, { useEffect, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import FadeAway from "../transitions/FadeAway/FadeAway";
import { SymbolStyle, AnimateMistyped } from "../../types/types";

interface Props {
  DisplayedSymbol: JSX.Element | null;
  TextCursor: JSX.Element | null;
  InvalidSymbol: JSX.Element | null;
  symbolStyle: SymbolStyle; // for memo
  setAnimateMistypedSymbol: React.Dispatch<React.SetStateAction<AnimateMistyped | null>>;
}

const useStyles = makeStyles({
  displayedSymbolWrapper: {
    position: "relative",
    display: "inline-box",
    whiteSpace: "pre"
  },
  symbol: {
    
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
  { DisplayedSymbol, TextCursor, InvalidSymbol, setAnimateMistypedSymbol }: Props
) {
  const classes = useStyles();
  const { transitions } = useTheme();
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
      {DisplayedSymbol}
      <FadeAway
        className={classes.invalidSymbol}
        inProp={displayInvalid}
        timeout={transitions.duration.complex}
        onExited={() => setAnimateMistypedSymbol(null)}
      >
        {InvalidSymbol}
      </FadeAway>
      {TextCursor}
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
