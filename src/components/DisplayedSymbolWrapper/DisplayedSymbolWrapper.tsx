import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import DisplayedSymbol from "../DisplayedSymbol/DisplayedSymbol";
import FadeAway from "../transitions/FadeAway/FadeAway";
import { type SymbolStyle, type AnimateMistyped, type CSSObjects } from "../../types/themeTypes";
import { getSymbolStyle } from "../DisplayedRow/helpFunctions";
import { PlayPageThemeContext } from "../../styles/themeContexts";
import TextCursor from "../TextCursor/TextCursor";

interface Props {
  textCursorHeight: string | null;
  symbolStyle: SymbolStyle; // for memo
  setAnimateMistypedSymbol: React.Dispatch<React.SetStateAction<AnimateMistyped | null>>;
  symbolPosition: number;
  animateMistypedSymbol: AnimateMistyped | null;
  symbol: string;
}

const styles: CSSObjects = {
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
};

function DisplayedSymbolWrapper({
  textCursorHeight, symbol, setAnimateMistypedSymbol,
  animateMistypedSymbol, symbolStyle, symbolPosition
}: Props) {
  const { transitions } = useTheme();
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext)
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
    <Box sx={styles.displayedSymbolWrapper}>
      <DisplayedSymbol symbol={symbol} symbolStyle={symbolStyle} />
      <FadeAway
        sx={styles.invalidSymbol}
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
      {textCursorHeight && <TextCursor height={textCursorHeight} />}
    </Box>
  );
}

const isEqual = (prevProps: Props, nextProps: Props) => {
  if(!areObjectValuesSame(prevProps.symbolStyle, nextProps.symbolStyle)) {
    return false;
  }

  if(prevProps.textCursorHeight !== nextProps.textCursorHeight) {
    return false;
  }

  if(nextProps.animateMistypedSymbol?.symbolPosition === nextProps.symbolPosition) {
    return false;
  }

  return true;
};

export default React.memo(DisplayedSymbolWrapper, isEqual);
