import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import { makeStyles, useTheme } from "@material-ui/core";
import {
  calculateDisplayTextInnerWidth,
  collectMistypedSymbolPositions,
  collectMistypedWords,
  createSymbolWidthsObject,
  getWordTimeObject,
  getPositions,
  getWordObject,
  updateSymbolCorrectness,
  updateWordTime,
  updateSymbolRows,
  getIndexes,
  isAllowedKey,
  isAllowedToMoveToNextSymbolOnMistake
} from "./helpFunctions";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import { calcTypingPrecision, calcTypingSpeedInKeystrokes, calcTypingSpeedInWPM } from "../../helpFunctions/calcTypigSpeed";
import adjustRowsToNewFontData from "../../textFunctions/adjustRowsToNewFontData";
import Timer from "../../accessories/Timer";
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { FontData, AnimateMistyped } from "../../types/themeTypes";
import { Row, SymbolCorrectness } from "../../types/symbolTypes";
import { ThemeContext } from "../../styles/themeContext";
import { transformTextToSymbolRows } from "../../textFunctions/transformTextToSymbolRows";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";

interface Props {
  fontData: FontData;
  restart: boolean;
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  timer: Timer;
  allowedMistypeCount: number;
}

interface FontDataAndTextRef {
  fontData: FontData | null;
  text: string;
}

type GameStatus = "settingUp" | "start" | "playing" | "finished";

interface MakeStylesProps {
  fontData: FontData;
  lineCount: number;
  rowHeight: number;
}

// TODO try dynamic width?
const useStyles = makeStyles(({ textDisplayTheme }) => ({
  textWindow: {
    boxSizing: "content-box",
    width: "800px",
    height: ({ lineCount, rowHeight }: MakeStylesProps) => `${rowHeight * lineCount}px`,
    ...textDisplayTheme.offset.display,
    fontFamily: ({ fontData }: MakeStylesProps) => fontData.fontFamily,
    fontSize: ({ fontData }: MakeStylesProps) => fontData.fontSize,
    borderTop: `1px solid ${textDisplayTheme.background.secondary}`,
    borderBottom: `1px solid ${textDisplayTheme.background.secondary}`,
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  topHiddenRow: {
    marginTop: ({ rowHeight }: MakeStylesProps) => (
      `-${rowHeight + transformPixelSizeToNumber(textDisplayTheme.offset.display.paddingTop)}px`
    ),
    paddingBottom: textDisplayTheme.offset.display.paddingTop
  }
}));

export default function TextDisplay({
  fontData, restart, setMistypedWords, setRestart, text, timer, allowedMistypeCount }: Props)
  {
  const [symbolRows, setSymbolRows] = useState<Row[]>([]);
  const [rowPosition, setRowPosition] = useState(0);
  const [wordPosition, setWordPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [enteredSymbol, setEnteredSymbol] = useState("");
  const [keyStrokeCount, setKeyStrokeCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [cssCalculatedrowHeight, setCssCalculatedRowHeight] = useState(50);
  const [gameStatus, setGameStatus] = useState<GameStatus>("settingUp");
  const [isRowInTransition, setIsRowInTransition] = useState(false);
  const [animateMistypedSymbol, setAnimateMistypedSymbol] = useState<AnimateMistyped | null>(null);

  const { transitions } = useTheme();
  const classes = useStyles({ fontData, lineCount, rowHeight: cssCalculatedrowHeight });
  const { state: { textDisplayTheme } } = useContext(ThemeContext);
  const wordTimer = useRef(new Timer(2));
  const textDisplayRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const fontDataAndTextRef: React.MutableRefObject<FontDataAndTextRef> = useRef({ fontData, text });

  const moveActiveSymbol = (by: -1 | 1) => {
    const newCursorPosition = cursorPosition + by;
    if(newCursorPosition < 0) return;

    const {
      rowPosition: newRowPosition,
      wordPosition: newWordPosition
    } = getPositions(newCursorPosition, symbolRows);
    // } = getPositions(newCursorPosition, symbolRows, rowPosition);
    
    if(newRowPosition !== rowPosition) {
      setIsRowInTransition(true);
      setRowPosition(newRowPosition);
    }
    // if(newRowPosition > rowPosition) {
    //   setIsRowInTransition(true);
    //   setRowPosition(newRowPosition);
    // }
    setWordPosition(newWordPosition);
    setCursorPosition(newCursorPosition);
  };

  // (on keypress === truthy enteredSymbol) check and adjust all the necessary stuff
  useEffect(() => {
    if(!enteredSymbol || gameStatus === "finished" || !symbolRows.length) return;
    if(gameStatus === "start") { // on first keypress
      timer.start();
      if(getWordObject(symbolRows, 0, 0)?.type === "word") {
        wordTimer.current.start();
      }
      setGameStatus("playing");
    }
    // if the transcription is completed
    if(cursorPosition >= text.length - 1) {
      timer.stop();
      setGameStatus("finished");

      const mistypedWords = collectMistypedWords(symbolRows);
      setMistypedWords(mistypedWords);

      const mistakeCount = collectMistypedSymbolPositions(symbolRows).length;
      const typingSpeed = calcTypingSpeedInKeystrokes(timer.getTime(), keyStrokeCount, mistakeCount);
      const wpm = calcTypingSpeedInWPM(text, timer.getTime(), mistypedWords.length);
      console.log(`strokes per minute: ${typingSpeed}`);
      console.log(`WPM: ${wpm}`);
      console.log(`${calcTypingPrecision(keyStrokeCount, mistakeCount)}%`);
      return;
    }

    // on Backspace
    if(enteredSymbol === "Backspace") {
      moveActiveSymbol(-1);
    } else
    // on mistyped symbol
    if(enteredSymbol !== text[cursorPosition]) {
      const updatedRow = updateSymbolCorrectness(symbolRows, rowPosition, cursorPosition, "mistyped");
      updateSymbolRows(setSymbolRows, updatedRow, rowPosition);
      setAnimateMistypedSymbol({
        symbol: enteredSymbol,
        symbolPosition: cursorPosition
      });

      const isAllowedToMoveToNextSymbol =
        isAllowedToMoveToNextSymbolOnMistake(symbolRows, cursorPosition, allowedMistypeCount);
      if(isAllowedToMoveToNextSymbol) {
        moveActiveSymbol(1);
      }
      
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
  })

  // on did mount add keypress event listener
  useEffect(() => {
    const onKeyDown = (key: string) => {
      setKeyStrokeCount(prevCount => prevCount + 1);
      
      if(isAllowedKey(key)) {
        setEnteredSymbol(key);
      }
    };

    window.addEventListener("keydown", ({ key }) => onKeyDown(key));
    return () => window.removeEventListener("keydown", ({ key }) => onKeyDown(key));
  }, [])

  // on pasted text, restart or changed font
  useLayoutEffect(() => {
    // return on null values
    if(!fontData || !textDisplayRef.current) return;
    
    // return if there are no symbolWidth data loaded
    const noSymbolWidths = !Object.keys(fontData.symbolWidths).length;
    if(noSymbolWidths) return;
    
    // after setting up continue with only text or fontData change
    if(gameStatus !== "settingUp" && areObjectValuesSame(fontDataAndTextRef.current, { fontData, text })) return;
    fontDataAndTextRef.current = { fontData, text };

    const { paddingLeft, paddingRight, width } = getComputedStyle(textDisplayRef.current); // example: 1234.56px
    const displayTextInnerWidth = calculateDisplayTextInnerWidth(width, paddingLeft, paddingRight);
    const symbolWidhtsObject = createSymbolWidthsObject(textDisplayTheme.offset["symbol"], fontData.symbolWidths);
    
    let newSymbolRows: Row[] = [];
    if(gameStatus !== "settingUp") {
      newSymbolRows = adjustRowsToNewFontData(symbolRows, displayTextInnerWidth, symbolWidhtsObject);
    } else {
      newSymbolRows = transformTextToSymbolRows(text, displayTextInnerWidth, symbolWidhtsObject);
    }
    
    const {
      rowPosition: newRowPosition,
      wordPosition: newWordPosition
    } = getPositions(cursorPosition, newSymbolRows);
    
    setRowPosition(newRowPosition);
    setSymbolRows(newSymbolRows);
    setWordPosition(newWordPosition);
    setLineCount(fontData.fontSize === "20px" ? 5 : 4); // 1 line is hidden in overflow

    if(gameStatus === "settingUp") {
      setGameStatus("start");
    }
  }, [cursorPosition, fontData, gameStatus, symbolRows, text, textDisplayTheme.offset])

  // on changed wordPosition adjust word timer
  useEffect(() => {
    if(!symbolRows.length || gameStatus !== "playing") return;
    
    const wordTimeObject = getWordTimeObject(wordTimer.current, symbolRows, rowPosition, wordPosition);
    if(!wordTimeObject) return;

    updateWordTime(symbolRows, setSymbolRows, wordTimeObject);
  }, [gameStatus, symbolRows, rowPosition, wordPosition])

  // on restart
  useEffect(() => {
    if(!restart) return;
    timer.reset();
    wordTimer.current.reset();
    setCursorPosition(0);
    setWordPosition(0);
    setRowPosition(0);
    setKeyStrokeCount(0);
    setSymbolRows([]);
    setGameStatus("settingUp");
    setEnteredSymbol("");
    setRestart(false);
  }, [restart, setRestart, timer])

  useEffect(() => {
    if(isRowInTransition) {
      setTimeout(() => setIsRowInTransition(false), transitions.duration.complex);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRowInTransition])

  const DisplayedRowComponents = symbolRows
    .filter((_, i) => { // adjust what rows should be displayed
      if(rowPosition < 2) { // when first or second row is active
        return i < lineCount;
      }
      return ( // when other rows are active
        i >= (rowPosition - 2) && // show 1 previous line and hide second previous for transition)...
        i < (rowPosition + lineCount - 1) // ...then show next lines based on lineCount(need to deduct 1 previous line)
      );
    })
    .map((row, rowIndex) => {
      return (
        <DisplayedRow
          className={classNames(
            rowIndex === 0 && rowPosition >= 2 && classes.topHiddenRow
          )}
          fontSize={fontData.fontSize}
          key={row.highestSymbolPosition}
          row={row}
          setRowHeight={rowIndex === 1? setCssCalculatedRowHeight : undefined}
          textPosition={cursorPosition}
          theme={textDisplayTheme}
          enteredSymbol={enteredSymbol}
          animateMistypedSymbol={animateMistypedSymbol}
          setAnimateMistypedSymbol={setAnimateMistypedSymbol} />
      );
    }
  );

  return(
    <div className={classes.textWindow} ref={textDisplayRef}>
      {DisplayedRowComponents}
    </div>
  );
};
