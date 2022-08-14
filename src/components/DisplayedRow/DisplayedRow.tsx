import React, { useLayoutEffect, useRef } from "react";
import { getRelativePosition, getSymbolStyle } from "./helpFunctions";
import { WordObject } from "../../types/symbolTypes";
import { FontSize, TextDisplayTheme, AnimateMistyped, CSSObjects } from "../../types/themeTypes";
import DisplayedSymbolWrapper from "../DisplayedSymbolWrapper/DisplayedSymbolWrapper";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import { Box, BoxProps } from "@mui/material";

interface Props extends BoxProps {
  fontSize: FontSize;
  words: WordObject[];
  setRowHeight: React.Dispatch<React.SetStateAction<number>>;
  shouldSetRowHeight: boolean;
  textPosition: number;
  theme: TextDisplayTheme;
  enteredSymbol: string;
  animateMistypedSymbol: AnimateMistyped | null;
  setAnimateMistypedSymbol: React.Dispatch<React.SetStateAction<AnimateMistyped | null>>
}

const styles:CSSObjects = {
  row: ({ transitions }) => ({
    whiteSpace: "nowrap",
    transition: `margin-top ${transitions.duration.complex}ms,
                 padding-bottom ${transitions.duration.complex}ms`
  })
};

export default function DisplayedRow({
  sx,
  fontSize,
  words,
  setRowHeight,
  shouldSetRowHeight,
  textPosition,
  theme,
  enteredSymbol,
  animateMistypedSymbol,
  setAnimateMistypedSymbol,
  ...boxProps
}: Props) {
  const divRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);

  useLayoutEffect(() => {
    if(divRef.current && shouldSetRowHeight) {
        const rowHeight = getComputedStyle(divRef.current!).height;
        setRowHeight(transformPixelSizeToNumber(rowHeight));
    }
  })

  const DisplayedSymbolWrapperComponents = words.map(({ symbols: wordInSymbols }) => {
    return wordInSymbols.map(({ symbol, symbolPosition, correctness }) => {
      const relativePosition = getRelativePosition(textPosition, symbolPosition);
      const symbolStyle = getSymbolStyle(correctness, relativePosition, theme);

      return (
        <DisplayedSymbolWrapper
          key={symbolPosition}
          symbolStyle={symbolStyle} // for memo
          symbol={symbol}
          textCursorHeight={
            relativePosition === "active"
              ? fontSize === "20px" ? "2px" : "3px"
              : null
          }
          setAnimateMistypedSymbol={setAnimateMistypedSymbol}
          symbolPosition={symbolPosition}
          animateMistypedSymbol={animateMistypedSymbol} />
      );
    });
  });

  return (
    <Box
      sx={[
        styles.row,
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...boxProps}
      ref={divRef}
    >
      {DisplayedSymbolWrapperComponents}
    </Box>
  );
};
