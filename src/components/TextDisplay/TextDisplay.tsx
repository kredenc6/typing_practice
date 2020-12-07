import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core";
import WebFont from "webfontloader";
import {
  calculateDisplayTextInnerWidth,
  collectMistypedWords,
  getPositions,
  getWordObject,
  updateRowWithMistype,
  updateRowWithWordTime,
  updateSymbolRows
} from "./helpFunctions";
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { Row, transformTextToSymbolRows } from "../../textFunctions/transformTextToSymbolRows";
import Timer from "../../accessories/Timer";
import { FontStyle, FontSymbolData } from "../../types/types";
import getFontData from "../../async/getFontData";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";

import loadFont from "../../async/loadFont"

interface Props {
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  text: string;
  textDisplayTheme: FontStyle;
  timer: Timer;
}

interface FontDataAndTextRef {
  fontData: FontSymbolData | null;
  text: string;
}

const useStyles = makeStyles(({ palette }) => ({
  textWindow: {
    width: "700px",
    // minWidth: "500px",
    // height: "4rem",
    margin: "1rem auto",
    padding: "0.5rem 1rem",
    fontFamily: ({ fontFamily }: FontStyle) => fontFamily,
    fontSize: ({ fontSize }: FontStyle) => fontSize,
    borderTop: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`
  }
}));

//BUG mistyped words reset after fontData change
export default function TextDisplay({ setMistypedWords, text, textDisplayTheme: fontStyle, timer }: Props) {
  const [fontData, setFontData] = useState<FontSymbolData | null>(null);
  const [symbolRows, setSymbolRows] = useState<Row[]>([]);
  const [rowPosition, setRowPosition] = useState(0);
  const [wordPosition, setWordPosition] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [enteredSymbol, setEnteredSymbol] = useState("");
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wordTimer, setWordTimer] = useState(new Timer(2));
  
  const styles = useStyles(fontData ? fontData : fontStyle);
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

  // on changed font style
  useEffect(() => {
    if(!fontStyle) return;
    getFontData(fontStyle.fontFamily, fontStyle.fontSize)
      .then(newFontData => {
        if(!newFontData) return;
        saveFontData(newFontData, setFontData);
      })
      .catch(err => console.log(err.message));

  }, [fontStyle])

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
    if(!fontData || !textDisplayRef.current) return;
    
    // return if it's just changed cursorPosition
    if(areObjectValuesSame(fontDataAndTextRef.current, { fontData, text })) return;
    fontDataAndTextRef.current = { fontData, text };

    const { paddingLeft, paddingRight, width } = getComputedStyle(textDisplayRef.current); // example: 1234.56px
    const displayTextInnerWidth = calculateDisplayTextInnerWidth(width, paddingLeft, paddingRight);
    const newSymbolRows = transformTextToSymbolRows(text, displayTextInnerWidth, fontData.symbolWidths);
    const {
      rowPosition: newRowPosition,
      wordPosition: newWordPosition
    } = getPositions(cursorPosition, newSymbolRows);
    
    setSymbolRows(newSymbolRows);
    setRowPosition(newRowPosition);
    setWordPosition(newWordPosition);
  }, [cursorPosition, fontData, text])

  useEffect(() => {
    if(!symbolRows.length) return;
    let adjustableRowPosition = rowPosition;
    let wordObject = getWordObject(symbolRows, adjustableRowPosition, wordPosition);

    if(!wordObject && adjustableRowPosition > 0) { // it's possible we moved to the next row - check the previous one
      adjustableRowPosition -= 1;
      wordObject = getWordObject(symbolRows, adjustableRowPosition, wordPosition);
    }
    if(!wordObject) {
      throw new Error("Did not get the needed word object.");
    }

    if(wordTimer.isRunning && wordObject.type !== "word") {
      wordTimer.stop();
      const wordTime = wordTimer.getTime();
      const previousWordPosition = wordObject.wordPosition - 1;
      const updatedRow = updateRowWithWordTime(symbolRows[adjustableRowPosition], previousWordPosition, wordTime);
      
      updateSymbolRows(setSymbolRows, updatedRow, adjustableRowPosition);
    }

    if(!wordTimer.isRunning && wordObject.type === "word") {
      wordTimer.start();
    }
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

function saveFontData(fontData: FontSymbolData, setFontData: (value: React.SetStateAction<FontSymbolData | null>) => void) {
  const { fontFamily, fontLocation } = fontData;
  if(fontLocation === "local") {
    setFontData(fontData);
  } else {
    const config = {
      [fontLocation]: {
        families: [fontFamily]
      },
      fontactive: () => {
        setFontData(fontData);
      }
    };

    loadFont(config);
  }
}