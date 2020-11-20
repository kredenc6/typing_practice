import React, { useEffect, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { useTheme } from "../../styles/theme";
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { Row, transformTextToSymbolRows } from "../../textFunctions/transformTextToSymbolRows";
import Timer from "../../accessories/Timer";
import { FontStyle, FontSymbolData } from "../../types/types";

import WebFont from "webfontloader";

interface Props {
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  text: string;
  timer: Timer;
}

const useStyles = createUseStyles({
  textWindow: {
    width: "700px",
    // minWidth: "500px",
    // height: "4rem",
    margin: "1rem auto",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    fontFamily: ({ fontFamily }: FontStyle) => fontFamily,
    fontSize: ({ fontSize }: FontStyle) => fontSize,
    border: "1px solid pink"
  }
});

const TextDisplay = ({ setMistypedWords, text, timer }: Props) => {
  const { textDisplayFontStyle: fontStyle } = useTheme();
  const styles = useStyles(fontStyle);

  const [fontData, setFontData] = useState<FontSymbolData | null>(null);
  const [symbolRows, setSymbolRows] = useState<Row[]>([]);
  const [rowPosition, setRowPosition] = useState(0);
  const [wordPosition, setWordPosition] = useState(0);
  const [textPosition, setTextPosition] = useState(0);
  const [enteredSymbol, setEnteredSymbol] = useState("");
  const [keyPressCount, setKeyPressCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wordTimer, setWordTimer] = useState(new Timer(2));

  const textDisplayRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);

  // (on keypress) check and adjust all the necessary stuff
  useEffect(() => {
    if(!enteredSymbol || isFinished) return;
    if(textPosition === 0 && !timer.isRunning) {
      timer.start();
      if(getWordObject(symbolRows, 0, 0)?.type === "word") {
        wordTimer.start();
      }
    }
    // if the transcription is completed
    if(textPosition + 1 >= text.length) {
      timer.stop();
      setIsFinished(true);

      const mistypedWords = collectMistypedWords(symbolRows);
      setMistypedWords(mistypedWords);
      return;
    }

    // on mistyped symbol
    if(enteredSymbol !== text[textPosition]) {
      const updatedRow = updateRowWithMistype(symbolRows, rowPosition, wordPosition, textPosition);
      
      updateSymbolRows(setSymbolRows, updatedRow, rowPosition);

    // on correctly typed symbol
    } else {
      const { rowPosition, wordPosition } = getPositions(symbolRows, textPosition + 1);
      setRowPosition(rowPosition);
      setWordPosition(wordPosition);
      setTextPosition(prevPosition => prevPosition + 1);
    }

    setEnteredSymbol(""); // reset typed symbol
  }, [enteredSymbol, isFinished, setMistypedWords, textPosition, timer, text, symbolRows, rowPosition, wordPosition, wordTimer])

  useEffect(() => {
    if(!fontStyle) return;
    console.log(`../../fontData/${fontStyle.fontFamily} ${fontStyle.fontSize}.json`)
    fetch(`../../fontData/${fontStyle.fontFamily} ${fontStyle.fontSize}.json`)
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then((newFontData: FontSymbolData) => {
        console.log(newFontData);
        WebFont.load({
          google: {
            families: ["Fira Code"]
            // families: [newFontData.fontFamily]
          }
        });
        
        setFontData(newFontData);
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

  // on pasted text
  useEffect(() => {
    if(!fontData) return;
    // TODO testing ref
    if(!textDisplayRef.current) return;
    const displayTextStyle = getComputedStyle(textDisplayRef.current) // example: 1234.56px
    const displayTextPadding = getComputedStyle(textDisplayRef.current).padding;
    const displayTextWidth = getComputedStyle(textDisplayRef.current).width; // example: 1234.56px
    const displayTextWidthInPixels = Number(displayTextWidth.slice(0, -2));
    console.log(textDisplayRef.current);
    console.dir(textDisplayRef.current);

    console.log(displayTextPadding);
    console.log(displayTextWidth);
    console.log(displayTextWidthInPixels);
    setSymbolRows(transformTextToSymbolRows(text, displayTextWidthInPixels, fontData.symbolWidths));
  }, [fontData, text])

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

  // on finished
  // useEffect(() => {
  //   if(isFinished) {
  //     const time = timer.getTime();
  //     const wordCount = symbolRows.reduce((wordCount, { words }) => wordCount + words.length, 0);
  //     console.log(`Time: ${time}s`);
  //     console.log(`Typing speed:
  //       ${calcTypingSpeed(time, text.length - mistypedSymbols.length)} chars/minute
  //       ${calcTypingSpeed(time, wordCount - mistypedWords.length)} words/minute
  //       `);
  //     console.log("You've reached the end of the text.");
  //     // console.log(mistypedWords);
  //     // console.log(mistypedSymbols);
  //     console.log(symbolRows);
  //   }
  // }, [isFinished, symbolRows, text, timer])
  
  const DisplayedRowComponents = symbolRows.map((row, rowIndex) =>  
      <DisplayedRow key={rowIndex} row={row} textPosition={textPosition} />
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

export default TextDisplay;


function updateRowWithMistype(symbolRows: Row[], rowPosition: number, wordPosition: number, textPosition: number) {
  const row = symbolRows[rowPosition];
  const wordPositionItTheRow =
    row.words.findIndex(({ wordPosition: comparedWordPosition }) => comparedWordPosition === wordPosition);
  const symbolPositionInTheWord =
    row.words[wordPositionItTheRow].symbols.findIndex(({ symbolPosition }) => symbolPosition === textPosition);

  const updatedWords = [...row.words];
  updatedWords[wordPositionItTheRow].wasCorrect = false;
  updatedWords[wordPositionItTheRow].symbols[symbolPositionInTheWord].wasCorrect = false;

  return { ...row, words: updatedWords };
}

function getWordObject(symbolRows: Row[], rowPosition: number, wordPosition: number) {
  const activeWordObject = symbolRows[rowPosition].words.find(
    ({ wordPosition: iteratedWordPosition }) => wordPosition === iteratedWordPosition);
  return activeWordObject || null;
}


function getPositions(symbolRows: Row[], textPosition: number) {
  let rowPosition = 0;
  let wordPosition = -1;

  for(const row of symbolRows) {
    if(row.highestSymbolPosition < textPosition) {
      rowPosition++;
      continue;
    }

    for(const word of row.words) {
      const isTheRightWord = word.symbols.some(({ symbolPosition }) => symbolPosition === textPosition);
      if(isTheRightWord) {
        wordPosition = word.wordPosition;
        break;
      }
    }
    break;
  }

  if(wordPosition === -1) {
    throw new Error("Did not get the needed word position.");
  }
  return {
    rowPosition,
    wordPosition
  }
}

function updateRowWithWordTime(row: Row, wordPosition: number, wordTime: number): Row {
  const updatedWords = row.words.map(word => {
    if(word.wordPosition === wordPosition) {
      return {...word, typedSpeed: wordTime };
    }
    return word;
  });

  return { ...row, words: updatedWords };
}

function updateSymbolRows(setSymbolRows: React.Dispatch<React.SetStateAction<Row[]>>, updatedRow: Row, updatedRowIndex: number) {
  setSymbolRows(prev => prev.map((row, i) => {
    if(i === updatedRowIndex) {
      return updatedRow;
    }
    return row;
  }));
}

const WORD_MIN_LENGTH_FOR_MISTYPED = 3;

function collectMistypedWords(symbolRows: Row[]) {
  return symbolRows.reduce((mistypedWords, row) => {
    const nextMistypedWords = row.words.filter(word => {
      return (
        word.type === "word" &&
        !word.wasCorrect &&
        word.symbols.length >= WORD_MIN_LENGTH_FOR_MISTYPED
      );
    });
    return [...mistypedWords, ...nextMistypedWords];
  }, [] as Row["words"]);
}

