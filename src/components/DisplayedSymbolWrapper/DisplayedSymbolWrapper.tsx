import React, { useEffect, useRef, useState } from "react";
import { Box, makeStyles, useTheme } from "@material-ui/core";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import DisplayedSymbol from "../DisplayedSymbol/DisplayedSymbol";
import FadeAway from "../transitions/FadeAway/FadeAway";
import { SymbolStyle, AnimateMistyped } from "../../types/themeTypes";
import { getSymbolStyle } from "../DisplayedRow/helpFunctions";

interface Props {
  TextCursor: JSX.Element | null;
  symbolStyle: SymbolStyle; // for memo
  setAnimateMistypedSymbol: React.Dispatch<React.SetStateAction<AnimateMistyped | null>>;
  symbolPosition: number;
  animateMistypedSymbol: AnimateMistyped | null;
  symbol: string;
}

const useStyles = makeStyles({
  displayedSymbolWrapper: {
    position: "relative",
    display: "inline-block",
    whiteSpace: "pre"
  },
  invalidSymbol: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  }
});

function DisplayedSymbolWrapper({
  TextCursor, symbol, setAnimateMistypedSymbol,
  animateMistypedSymbol, symbolStyle, symbolPosition
}: Props) {
  const classes = useStyles();
  const { transitions, textDisplayTheme } = useTheme();
  const [displayInvalid, setDisplayInvalid] = useState(false);
  const timeoutIdRef = useRef(-1);

  useEffect(() => {
    if(animateMistypedSymbol && !animateMistypedSymbol.isAllowedToMoveToNextSymbol &&
      animateMistypedSymbol.symbolPosition === symbolPosition) {
      clearTimeout(timeoutIdRef.current);
    }

    if(animateMistypedSymbol?.symbolPosition === symbolPosition) {
      setDisplayInvalid(true);
      const newTimeoutId = window.setTimeout(
        () =>  {
          setDisplayInvalid(false);
        },
        transitions.duration.complex
      );
      timeoutIdRef.current = newTimeoutId;
    }
      
  },[animateMistypedSymbol, symbolPosition, transitions.duration.complex])

  return(
    <Box className={classes.displayedSymbolWrapper}>
      <DisplayedSymbol symbol={symbol} symbolStyle={symbolStyle} />
        <FadeAway
          className={classes.invalidSymbol}
          inProp={displayInvalid}
          timeout={transitions.duration.complex}
          onExited={() => setAnimateMistypedSymbol(null)}
        >
          {animateMistypedSymbol &&
            <DisplayedSymbol
              symbol={animateMistypedSymbol?.symbol}
              symbolStyle={getSymbolStyle("invalid", "processed", textDisplayTheme)} />
          }
        </FadeAway>
      {TextCursor}
    </Box>
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
  if(nextProps.animateMistypedSymbol?.symbolPosition === nextProps.symbolPosition) {
    return false;
  }

  return true;
};

export default React.memo(DisplayedSymbolWrapper, isEqual);
