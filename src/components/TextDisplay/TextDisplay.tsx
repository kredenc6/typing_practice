import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import { calcTypingPrecision, calcTypingSpeedInKeystrokes, calcTypingSpeedInWPM } from "../../helpFunctions/calcTypigSpeed";
import { Row, transformTextToSymbolRows } from "../../textFunctions/transformTextToSymbolRows";
import adjustRowsToNewFontData from "../../textFunctions/adjustRowsToNewFontData";
import Timer from "../../accessories/Timer";
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { FontData, TextDisplayTheme } from "../../types/types";

interface Props {
  fontData: FontData;
  restart: boolean;
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  theme: TextDisplayTheme;
  timer: Timer;
}

interface FontDataAndTextRef {
  fontData: FontData | null;
  text: string;
}

type GameStatus = "settingUp" | "start" | "playing" | "finished";

const useStyles = makeStyles(({ palette }) => ({
  textWindow: {
    width: "800px",
    margin: ({ offset }: FontData & TextDisplayTheme) => offset.display.margin,
    padding: ({ offset }: FontData & TextDisplayTheme) => offset.display.padding,
    fontFamily: ({ fontFamily }: FontData & TextDisplayTheme) => fontFamily,
    fontSize: ({ fontSize }: FontData & TextDisplayTheme) => fontSize,
    borderTop: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`,
    whiteSpace: "nowrap"
  }
}));

export default function TextDisplay({ fontData, restart, setMistypedWords, setRestart, theme, text, timer }: Props) {
  const [symbolRows, setSymbolRows] = useState<Row[]>([]);
  const [rowPosition, setRowPosition] = useState(0);
  const [wordPosition, setWordPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [enteredSymbol, setEnteredSymbol] = useState("");
  const [keyStrokeCount, setKeyStrokeCount] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("settingUp");
  
  const classes = useStyles({ ...fontData, ...theme });
  const wordTimer = useRef(new Timer(2));
  const textDisplayRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const fontDataAndTextRef: React.MutableRefObject<FontDataAndTextRef> = useRef({ fontData, text });

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
      
      // on correctly typed symbol
    } else {
      const newCursorPosition = cursorPosition + 1;
      const {
        rowPosition: newRowPosition,
        wordPosition: newWordPosition
      } = getPositions(newCursorPosition, symbolRows, rowPosition);
      
      setRowPosition(newRowPosition);
      setWordPosition(newWordPosition);
      setCursorPosition(newCursorPosition);
    }
    
    setEnteredSymbol(""); // reset typed symbol
  }, [cursorPosition, enteredSymbol, gameStatus, keyStrokeCount, setMistypedWords, symbolRows, rowPosition, text, timer, wordPosition])

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
    const symbolWidhtsObject = createSymbolWidthsObject(theme.offset["text"], fontData.symbolWidths);
    
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
    
    setSymbolRows(newSymbolRows);
    setRowPosition(newRowPosition);
    setWordPosition(newWordPosition);

    if(gameStatus === "settingUp") {
      setGameStatus("start");
    }
  }, [cursorPosition, fontData, gameStatus, symbolRows, text, theme.offset])

  // word timer
  useEffect(() => {
    if(!symbolRows.length || gameStatus !== "playing") return;
    
    const wordTimeObject = getWordTimeObject(wordTimer.current, symbolRows, rowPosition, wordPosition);
    if(!wordTimeObject) return;

    updateWordTime(symbolRows, setSymbolRows, wordTimeObject);
  }, [gameStatus, symbolRows, rowPosition, wordPosition])

  // restart
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

  const DisplayedRowComponents = symbolRows.map((row, rowIndex) =>  
      <DisplayedRow fontSize={fontData.fontSize} key={rowIndex} row={row} textPosition={cursorPosition} theme={theme} />
    ).filter((_, i) => { // adjust what rows should be displayed
      if(rowPosition < 2) {
        return i < 4;
      }
      return (
        (rowPosition - 1) <= i &&
        (rowPosition + 2) >= i
      );
  });

  return(
    <div className={classes.textWindow} ref={textDisplayRef}>
      {DisplayedRowComponents}
    </div>
  );
};
