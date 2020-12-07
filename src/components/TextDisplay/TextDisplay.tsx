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
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { Row, transformTextToSymbolRows } from "../../textFunctions/transformTextToSymbolRows";
import Timer from "../../accessories/Timer";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import { FontData } from "../../types/types";

interface Props {
  fontData: FontData;
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  text: string;
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
    margin: "1rem auto",
    padding: "0.5rem 1rem",
    fontFamily: ({ fontFamily }: FontData) => fontFamily,
    fontSize: ({ fontSize }: FontData) => fontSize,
    borderTop: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`
  }
}));

//BUG ctrl+v text throws
export default function TextDisplay({ fontData, setMistypedWords, text, timer }: Props) {
  const [symbolRows, setSymbolRows] = useState<Row[]>([]);
  const [rowPosition, setRowPosition] = useState(0);
  const [wordPosition, setWordPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [enteredSymbol, setEnteredSymbol] = useState("");
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wordTimer] = useState(new Timer(2));
  
  const styles = useStyles(fontData);
  const textDisplayRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const fontDataAndTextRef: React.MutableRefObject<FontDataAndTextRef> = useRef({ fontData, text });

  // (on keypress) check and adjust all the necessary stuff
  useEffect(() => {
    if(!enteredSymbol || isFinished) return;
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
  }, [enteredSymbol, isFinished, setMistypedWords, cursorPosition, timer, text, symbolRows, rowPosition, wordPosition, wordTimer])

  // on did mount add keypress event listener
  useEffect(() => {
    const onKeyDown = (key: string) => {
      if(key.length > 1) return;

      setKeyPressCount(prevCount => prevCount + 1);
      setEnteredSymbol(key);
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
      <DisplayedRow key={rowIndex} row={row} textPosition={cursorPosition} />
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
    <div className={styles.textWindow} ref={textDisplayRef}>
      {DisplayedRowComponents}
    </div>
  );
};
