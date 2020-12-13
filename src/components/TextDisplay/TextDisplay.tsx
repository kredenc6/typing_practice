import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core";
import {
  calculateDisplayTextInnerWidth,
  collectMistypedSymbolPositions,
  collectMistypedWords,
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
import Timer from "../../accessories/Timer";
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { FontData, TextDisplayTheme } from "../../types/types";

interface Props {
  fontData: FontData;
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  text: string;
  theme: TextDisplayTheme;
  timer: Timer;
}

interface FontDataAndTextRef {
  fontData: FontData | null;
  text: string;
}

const useStyles = makeStyles(({ palette }) => ({
  textWindow: {
    width: "700px",
    // minWidth: "500px",
    // height: "4rem",
    margin: ({ offset }: FontData & TextDisplayTheme) => offset.display.margin,
    padding: ({ offset }: FontData & TextDisplayTheme) => offset.display.padding,
    fontFamily: ({ fontFamily }: FontData & TextDisplayTheme) => fontFamily,
    fontSize: ({ fontSize }: FontData & TextDisplayTheme) => fontSize,
    borderTop: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`,
    whiteSpace: "nowrap"
  }
}));

//BUG ctrl+v text throws
export default function TextDisplay({ fontData, setMistypedWords, theme, text, timer }: Props) {
  const [symbolRows, setSymbolRows] = useState<Row[]>([]);
  const [rowPosition, setRowPosition] = useState(0);
  const [wordPosition, setWordPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [enteredSymbol, setEnteredSymbol] = useState("");
  const [keyStrokeCount, setKeyStrokeCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wordTimer] = useState(new Timer(2));
  
  const classes = useStyles({ ...fontData, ...theme });
  const textDisplayRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const fontDataAndTextRef: React.MutableRefObject<FontDataAndTextRef> = useRef({ fontData, text });

  // (on keypress) check and adjust all the necessary stuff
  useEffect(() => {
    if(!enteredSymbol || isFinished || !symbolRows.length) return;
    if(cursorPosition === 0 && !timer.isRunning) {
      timer.start();
      if(getWordObject(symbolRows, 0, 0)?.type === "word") {
        wordTimer.start();
      }
    }
    // if the transcription is completed
    if(cursorPosition >= text.length - 1) {
      timer.stop();
      setIsFinished(true);

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
  }, [enteredSymbol, isFinished, setMistypedWords, cursorPosition, keyStrokeCount, timer, text, symbolRows, rowPosition, wordPosition, wordTimer])

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

  // on pasted text or changed font
  useEffect(() => {
    // return on null values
    if(!fontData || !textDisplayRef.current) return;
    
    // return if there are no symbolWidth data loaded
    const noSymbolWidths = !Object.keys(fontData.symbolWidths).length;
    if(noSymbolWidths) return;
    
    // continue with only text or fontData change
    if(areObjectValuesSame(fontDataAndTextRef.current, { fontData, text })) return;
    fontDataAndTextRef.current = { fontData, text };

    const mistypedSymbolPositions = collectMistypedSymbolPositions(symbolRows);
    const { paddingLeft, paddingRight, width } = getComputedStyle(textDisplayRef.current); // example: 1234.56px
    const displayTextInnerWidth = calculateDisplayTextInnerWidth(width, paddingLeft, paddingRight);
    const newSymbolRows = transformTextToSymbolRows(text, displayTextInnerWidth, fontData.symbolWidths, mistypedSymbolPositions);
    const {
      rowPosition: newRowPosition,
      wordPosition: newWordPosition
    } = getPositions(cursorPosition, newSymbolRows);
    
    setSymbolRows(newSymbolRows);
    setRowPosition(newRowPosition);
    setWordPosition(newWordPosition);
  }, [cursorPosition, fontData, symbolRows, text])

  // word timer
  useEffect(() => {
    if(!symbolRows.length) return;
    
    const wordTimeObject = getWordTimeObject(wordTimer, symbolRows, rowPosition, wordPosition);
    if(!wordTimeObject) return;

    updateWordTime(symbolRows, setSymbolRows, wordTimeObject);
  }, [symbolRows, rowPosition, wordPosition, wordTimer])

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
