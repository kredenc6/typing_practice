import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Theme, useTheme } from "@mui/material";
import {
  createSymbolWidthsObject, getPositions, updateSymbolCorrectness, updateWordProp,
  updateSymbolRows, getIndexes, isAllowedKey, isAllowedToMoveToNextSymbolOnMistake,
  createPartialResultObj, isPlayingGameStatus, getWordProp, getLastSymbol
} from "./helpFunctions";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import adjustRowsToNewFontData from "../../textFunctions/adjustRowsToNewFontData";
import Timer from "../../accessories/Timer";
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { FontData, AnimateMistyped, TextDisplayTheme, CSSObjectFunctionsWithProp, CSSObjects } from "../../types/themeTypes";
import { Row, SymbolCorrectness } from "../../types/symbolTypes";
import { PlayPageThemeContext } from "../../styles/themeContexts";
import { transformTextToSymbolRows } from "../../textFunctions/transformTextToSymbolRows";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import { AllowedMistype, GameStatus, Results, WordTimeObj } from "../../types/otherTypes";
import { shouldStartSelfType, shouldStopSelfType } from "../../admin/selfTypeSymbol";

const LINE_MOVEMENT_MIN_POSITION = 3;
const FIREFOX_PREVENTED_KEY_DEFAULTS = ["backspace", "'"];

interface Props {
  fontData: FontData;
  restart: boolean;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  timer: Timer;
  allowedMistype: AllowedMistype;
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
  setResultObj: React.Dispatch<React.SetStateAction<Results | null>>;
}

interface FontDataAndTextRef {
  fontData: FontData | null;
  text: string;
}

interface MakeStylesProps {
  textDisplayTheme: TextDisplayTheme;
  fontData: FontData;
  lineCount: number;
  rowHeight: number;
}

const styles: CSSObjects = {
  bottomHiddenRow: {
    marginTop: "5px"
  }
};

// TODO try dynamic width?
const styleFunctions: CSSObjectFunctionsWithProp = {
  textWindow: (_ , prop) => {
    const { lineCount, rowHeight, textDisplayTheme, fontData } = prop as MakeStylesProps;
    
    return {
      boxSizing: "content-box",
      position: "absolute",
      top: "40%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "800px",
      height: `${rowHeight * lineCount}px`,
      marginTop: textDisplayTheme.offset.display.marginTop,
      marginRight: textDisplayTheme.offset.display.marginRight,
      marginBottom: textDisplayTheme.offset.display.marginBottom,
      marginLeft: textDisplayTheme.offset.display.marginLeft,
      paddingTop: textDisplayTheme.offset.display.paddingTop,
      paddingRight: textDisplayTheme.offset.display.paddingRight,
      paddingBottom: textDisplayTheme.offset.display.paddingBottom,
      paddingLeft: textDisplayTheme.offset.display.paddingLeft,
      fontFamily: fontData.fontFamily,
      fontSize: fontData.fontSize,
      borderTop: `1px solid ${textDisplayTheme.text.main}`,
      borderBottom: `1px solid ${textDisplayTheme.text.main}`,
      whiteSpace: "nowrap",
      overflow: "hidden"
    }
  },
  topHiddenRow: (_ , prop) => {
    const { rowHeight, textDisplayTheme } = prop as MakeStylesProps;
    
    return {
      marginTop: 
        `-${rowHeight + transformPixelSizeToNumber(textDisplayTheme.offset.display.paddingTop)}px`,
      paddingBottom: textDisplayTheme.offset.display.paddingTop
    }
  }
};

export default function TextDisplay({
  fontData, restart, setRestart, text, timer, allowedMistype, gameStatus,
  setGameStatus, setResultObj
}: Props) {
  const [symbolRows, setSymbolRows] = useState<Row[]>([]);
  const [rowPosition, setRowPosition] = useState(0);
  const [wordPosition, setWordPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [enteredSymbol, setEnteredSymbol] = useState("");
  const [keyStrokeCount, setKeyStrokeCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [cssCalculatedRowHeight, setCssCalculatedRowHeight] = useState(50);
  const [isRowInTransition, setIsRowInTransition] = useState(false);
  const [animateMistypedSymbol, setAnimateMistypedSymbol] = useState<AnimateMistyped | null>(null);

  const { transitions } = useTheme();
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);
  // const classes = useStyles({ textDisplayTheme, fontData, lineCount, rowHeight: cssCalculatedRowHeight });
  const stylePropObject = { textDisplayTheme, fontData, lineCount, rowHeight: cssCalculatedRowHeight };
  const wordTimerObj = useRef<WordTimeObj>({
    timer: new Timer(2),
    wordPosition: 0
  });
  const textDisplayRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const fontDataAndTextRef: React.MutableRefObject<FontDataAndTextRef> = useRef({ fontData, text });
  const gameHasStartedRef = useRef(false);

  const moveActiveSymbol = (by: -1 | 1) => {
    const newCursorPosition = cursorPosition + by;
    // reached start/end of text
    if(newCursorPosition < 0 || newCursorPosition >= text.length) return;

    const {
      rowPosition: newRowPosition,
      wordPosition: newWordPosition
    } = getPositions(newCursorPosition, symbolRows);

    if(newRowPosition !== rowPosition) {
      setIsRowInTransition(true);
      setRowPosition(newRowPosition);
    }

    setWordPosition(newWordPosition);
    setCursorPosition(newCursorPosition);
  };

  // on first keypress and finish
  useEffect(() => {
    if(!gameHasStartedRef.current && enteredSymbol) {
      timer.start();
      const typeOfTheFirstWord = getWordProp(symbolRows, "type", 0, 0);
      if(typeOfTheFirstWord === "word") {
        wordTimerObj.current.timer.start();
      }
      gameHasStartedRef.current = true;
      if(gameStatus !== "selfType") {
        setGameStatus("playing");
      }
    }

    // when finished
    // wait for the last correctly typed symbol
    const lastSymbol = getLastSymbol(symbolRows);
    if(
      !(lastSymbol?.correctness === "correct" ||
      lastSymbol?.correctness === "corrected") ||
      gameStatus === "finished" // prevent multiple triggers
    ) {
      return;
    }

    timer.stop();
    setGameStatus("finished");
    if(cursorPosition === text.length) { // return cursor position to valid index
      setCursorPosition(cursorPosition - 1);
    }
    const resultObj: Results = {
      ...createPartialResultObj(symbolRows, timer.getTime(), keyStrokeCount),
      textLength: text.length,
      timestamp: Date.now()
    };
    
    setResultObj(resultObj);
  },[cursorPosition, text, keyStrokeCount, timer, symbolRows, gameStatus, setGameStatus, setResultObj, enteredSymbol ])

  // on keypress(when enteredSymbol is truthy) check and adjust all the necessary stuff
  useEffect(() => {
    if(!enteredSymbol || !symbolRows.length) return;

    // on Backspace
    if(enteredSymbol === "Backspace") {
      moveActiveSymbol(-1);
    }
    
    // on mistyped symbol
    else if(enteredSymbol !== text[cursorPosition]) {
      const updatedRow = updateSymbolCorrectness(symbolRows, rowPosition, cursorPosition, "mistyped");
      updateSymbolRows(setSymbolRows, updatedRow, rowPosition);

      const isAllowedToMoveToNextSymbol =
        isAllowedToMoveToNextSymbolOnMistake(symbolRows, cursorPosition, allowedMistype);
      if(isAllowedToMoveToNextSymbol) {
        moveActiveSymbol(1);
      }
      setAnimateMistypedSymbol({
        symbol: enteredSymbol,
        symbolPosition: cursorPosition,
        isAllowedToMoveToNextSymbol
      });
      
    // on correctly typed symbol
    } else {
      const { symbolIndex, wordIndex, rowIndex } = getIndexes(cursorPosition, symbolRows);
      const activeSymbolCorrectness = symbolRows[rowIndex].words[wordIndex].symbols[symbolIndex].correctness;
      const updatedSymbolCorrectness: SymbolCorrectness =
        activeSymbolCorrectness === "mistyped" ||
        activeSymbolCorrectness === "corrected"
          ? "corrected"
          : "correct";
      const updatedRow = updateSymbolCorrectness(symbolRows, rowPosition, cursorPosition, updatedSymbolCorrectness);

      updateSymbolRows(setSymbolRows, updatedRow, rowPosition);
      moveActiveSymbol(1);
    }
    setEnteredSymbol(""); // reset typed symbol

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[enteredSymbol])

  // update keypress event listener on gameStatus change
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if(!["ready", "playing", "selfType"].includes(gameStatus)) return;
      
      const { key, ctrlKey } = e;

      // prevent some browser default "onKey" actions (firefox mainly)
      if(FIREFOX_PREVENTED_KEY_DEFAULTS.includes(key.toLowerCase())) {
        e.preventDefault();
      }

      const startSelfType = shouldStartSelfType(ctrlKey, key, gameStatus);
      // run self type
      if(startSelfType) {
        setGameStatus("selfType");
        return;
      }

      const stopSelfType = shouldStopSelfType(ctrlKey, key, gameStatus);
      // stop self type
      if(stopSelfType) {
        setGameStatus("playing");
        return;
      }
      
      setKeyStrokeCount(prevCount => prevCount + 1);
      if(isAllowedKey(key)) {
        setEnteredSymbol(key);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus])

  // self type
  useEffect(() => {
    if(enteredSymbol || gameStatus !== "selfType") return;

    const MISTYPE_EVERY_NTH_SYMBOL = 15;
    const SELFTYPE_SYMBOL_DELAY_MS = 0;
    const shouldMistype = !(Math.round(Math.random() * 100) / MISTYPE_EVERY_NTH_SYMBOL % 1);
    
    const selfType = () => {
      if(shouldMistype) {
        const wrongKey = text[cursorPosition] !== "a"
          ? "a"
          : "b";
        setEnteredSymbol(wrongKey);
      } else {
        setEnteredSymbol(text[cursorPosition]);
      }
      setKeyStrokeCount(prevCount => prevCount + 1);
    };

    setTimeout(selfType, SELFTYPE_SYMBOL_DELAY_MS);
  },[gameStatus, enteredSymbol, text, cursorPosition])

  // on pasted text, restart or changed font
  useLayoutEffect(() => {
    // return on null values
    if(!fontData || !textDisplayRef.current) return;
    
    // return if there are no symbolWidth data loaded
    const noSymbolWidths = !Object.keys(fontData.symbolWidths).length;
    if(noSymbolWidths) {
      console.error("No symbol widths!");
      return;
    }
    
    // after setting up continue with only text or fontData change
    if(gameStatus !== "settingUp" && areObjectValuesSame(fontDataAndTextRef.current, { fontData, text })) return;
    fontDataAndTextRef.current = { fontData, text };

    const { width } = getComputedStyle(textDisplayRef.current); // example: 1234.56px
    const displayTextWidth = transformPixelSizeToNumber(width);
    const symbolWidhtsObject = createSymbolWidthsObject(textDisplayTheme.offset["symbol"], fontData.symbolWidths);
    
    let newSymbolRows: Row[] = [];
    if(gameStatus !== "settingUp") {
      newSymbolRows = adjustRowsToNewFontData(symbolRows, displayTextWidth, symbolWidhtsObject);
    } else {
      newSymbolRows = transformTextToSymbolRows(text, displayTextWidth, symbolWidhtsObject);
    }
    
    const {
      rowPosition: newRowPosition,
      wordPosition: newWordPosition
    } = getPositions(cursorPosition, newSymbolRows);
    
    setRowPosition(newRowPosition);
    setSymbolRows(newSymbolRows);
    setWordPosition(newWordPosition);
    setLineCount(fontData.fontSize === "20px" ? 6 : 5); // 1 line is hidden in overflow

    if(gameStatus === "settingUp") {
      setGameStatus("ready");
    }
  }, [cursorPosition, fontData, gameStatus, symbolRows, text, textDisplayTheme.offset, setGameStatus])

  // on changed wordPosition adjust word timer
  useEffect(() => {
    if(!symbolRows.length || !isPlayingGameStatus(gameStatus)) return;
    
    if(wordPosition === wordTimerObj.current.wordPosition) return;

    const {
      timer,
      wordPosition: timerWordPosition
    } = wordTimerObj.current;
    
    const typeOfTheNewWord = getWordProp(symbolRows, "type", wordPosition);
    
    if(typeOfTheNewWord !== "word") {
      timer.stop();
      const wordTime = timer.getTime();
      timer.reset();
      updateWordProp(symbolRows, setSymbolRows, "typedSpeed", { value: wordTime, wordPosition: timerWordPosition });
    } else {
      // continue with previous time(when backspaced) or start at 0
      const previousTypedSpeed = getWordProp(symbolRows, "typedSpeed", wordPosition);
      const typedSpeedStartTime = Math.max(0, previousTypedSpeed);
      timer.start(typedSpeedStartTime);
    }

    wordTimerObj.current.wordPosition = wordPosition;
  }, [gameStatus, symbolRows, rowPosition, wordPosition])

  // on restart
  useEffect(() => {
    if(!restart) return;
    timer.reset();
    wordTimerObj.current.timer.reset();
    setCursorPosition(0);
    setWordPosition(0);
    setRowPosition(0);
    setKeyStrokeCount(0);
    setSymbolRows([]);
    setGameStatus("settingUp");
    setEnteredSymbol("");
    gameHasStartedRef.current = false;
    setRestart(false);
  }, [restart, setRestart, timer, setGameStatus])

  useEffect(() => { // BUGprone - connect the timeount/transition delay into 1 variable
    if(isRowInTransition) {
      setTimeout(() => setIsRowInTransition(false), transitions.duration.complex);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRowInTransition])

  const DisplayedRowComponents = symbolRows
    .filter((_, i) => { // adjust what rows should be displayed
      if(rowPosition < LINE_MOVEMENT_MIN_POSITION) { // when first or second row is active
        return i < lineCount;
      }
      return ( // when other rows are active
        i >= (rowPosition - LINE_MOVEMENT_MIN_POSITION) && // show 1 previous line and hide second previous for transition)...
        i < (rowPosition + lineCount) // ...then show next lines based on lineCount(+ 1 extra hidden for transition)
      );
    })
    .map((row, rowIndex) => {
      const shouldSetRowHeight = 
        (symbolRows.length <= lineCount && rowIndex === 0) ||
        (symbolRows.length > lineCount && rowIndex === 2);

      return (
        <DisplayedRow
          sx={[
            rowIndex === 0 && rowPosition >= LINE_MOVEMENT_MIN_POSITION && ((theme: Theme) => styleFunctions.topHiddenRow(theme, stylePropObject)),
            rowIndex === lineCount && rowPosition < LINE_MOVEMENT_MIN_POSITION && styles.bottomHiddenRow,
            rowIndex === lineCount + 1 && styles.bottomHiddenRow
          ].filter(conditionResult => typeof conditionResult !== "boolean")}
          fontSize={fontData.fontSize}
          key={row.highestSymbolPosition}
          words={row.words}
          setRowHeight={setCssCalculatedRowHeight}
          shouldSetRowHeight={shouldSetRowHeight}
          textPosition={cursorPosition}
          theme={textDisplayTheme}
          enteredSymbol={enteredSymbol}
          animateMistypedSymbol={animateMistypedSymbol}
          setAnimateMistypedSymbol={setAnimateMistypedSymbol} />
      );
    }
  );

  return(
    <Box
      sx={theme => styleFunctions.textWindow(theme, stylePropObject)}
      ref={textDisplayRef}
    >
      {DisplayedRowComponents}
    </Box>
  );
};
