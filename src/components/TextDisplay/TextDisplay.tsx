import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";
import {
  calculateDisplayTextInnerWidth,
  collectMistypedSymbolPositions,
  collectMistypedWords,
  createSymbolWidthsObject,
  getWordTimeObject,
  getPositions,
  getWordObject,
  updateRowWithMistype,
  updateWordTime,
  updateSymbolRows
} from "./helpFunctions";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import { calcTypingPrecision, calcTypingSpeedInKeystrokes, calcTypingSpeedInWPM } from "../../helpFunctions/calcTypigSpeed";
import { Row, transformTextToSymbolRows } from "../../textFunctions/transformTextToSymbolRows";
import adjustRowsToNewFontData from "../../textFunctions/adjustRowsToNewFontData";
import Timer from "../../accessories/Timer";
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { FontData, AnimateMistyped } from "../../types/types";
import { ThemeContext } from "../../styles/themeContext";

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
  rowHeight: string;
}

const TRANSITION_DURATION = 500;


// TODO try dynamic width?
const useStyles = makeStyles(({ textDisplayTheme }) => ({
  textWindow: {
    positon: "relative",
    boxSizing: "content-box",
    width: "800px",
    height: ({ lineCount, rowHeight }: MakeStylesProps) => `${transformPixelSizeToNumber(rowHeight) * lineCount}px`,
    margin: textDisplayTheme.offset.display.margin,
    padding: textDisplayTheme.offset.display.padding,
    fontFamily: ({ fontData }: MakeStylesProps) => fontData.fontFamily,
    fontSize: ({ fontData }: MakeStylesProps) => fontData.fontSize,
    borderTop: `1px solid ${textDisplayTheme.background.secondary}`,
    borderBottom: `1px solid ${textDisplayTheme.background.secondary}`,
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  rowMovingUp: {
    marginTop: ({ rowHeight }: MakeStylesProps) => `-${rowHeight}`
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
  const [rowHeight, setRowHeight] = useState("50px");
  const [gameStatus, setGameStatus] = useState<GameStatus>("settingUp");
  const [isRowInTransition, setIsRowInTransition] = useState(false);
  const [subsequentMistypeCount, setSubsequentMistypeCount] = useState(0);
  const [animateMistypedSymbol, setAnimateMistypedSymbol] = useState<AnimateMistyped | null>(null)

  const classes = useStyles({ fontData, lineCount, rowHeight });
  const { state: { textDisplayTheme } } = useContext(ThemeContext);
  const wordTimer = useRef(new Timer(2));
  const textDisplayRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const fontDataAndTextRef: React.MutableRefObject<FontDataAndTextRef> = useRef({ fontData, text });

  const handleUpdateTypedSymbol = () => {
    const newCursorPosition = cursorPosition + 1;
    const {
      rowPosition: newRowPosition,
      wordPosition: newWordPosition
    } = getPositions(newCursorPosition, symbolRows, rowPosition);
    
    if(newRowPosition > rowPosition) {
      setIsRowInTransition(true);
      setRowPosition(newRowPosition);
    }
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

    // on mistyped symbol
    if(enteredSymbol !== text[cursorPosition]) {
      const updatedRow = updateRowWithMistype(symbolRows, rowPosition, wordPosition, cursorPosition);
      updateSymbolRows(setSymbolRows, updatedRow, rowPosition);
      setSubsequentMistypeCount(subsequentMistypeCount + 1);
      setAnimateMistypedSymbol({
        symbol: enteredSymbol,
        symbolPosition: cursorPosition
      });

      if(allowedMistypeCount > subsequentMistypeCount) {
        handleUpdateTypedSymbol();
      }
      
      // on correctly typed symbol
    } else {
      handleUpdateTypedSymbol();
      setSubsequentMistypeCount(0);
    }
    
    setEnteredSymbol(""); // reset typed symbol
  })

  // on did mount add keypress event listener
  useEffect(() => {
    const onKeyDown = (key: string) => {
      setKeyStrokeCount(prevCount => prevCount + 1);
      
      if(key.length === 1) {
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
      setTimeout(() => setIsRowInTransition(false), TRANSITION_DURATION);
    }
  }, [isRowInTransition])

  const DisplayedRowComponents = symbolRows
    .filter((_, i) => { // adjust what rows should be displayed
      if(rowPosition < 2) { // when first or second row is active
        return i < lineCount;
      }
      return ( // when other rows are active
        i >= (rowPosition - 1 - Number(isRowInTransition)) && // show 1 previous line(or 2 when in transition)...
        i < (rowPosition + lineCount - 1) // ...then next lines based on lineCount(need to deduct 1 previous line)
      );
    })
    .map((row, rowIndex) => {
      if(rowIndex === 0) {
        return (
          <DisplayedRow
            className={classNames((rowPosition > 1 && isRowInTransition) && classes.rowMovingUp)}
            fontSize={fontData.fontSize}
            key={row.highestSymbolPosition}
            row={row}
            setRowHeight={setRowHeight}
            textPosition={cursorPosition}
            theme={textDisplayTheme}
            enteredSymbol={enteredSymbol}
            animateMistypedSymbol={animateMistypedSymbol}
            setAnimateMistypedSymbol={setAnimateMistypedSymbol} />
        );
      }
      return (
        <DisplayedRow
          fontSize={fontData.fontSize}
          key={row.highestSymbolPosition}
          row={row}
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
