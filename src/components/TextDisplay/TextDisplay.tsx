import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import { makeStyles, useTheme } from "@material-ui/core";
import {
  createSymbolWidthsObject, getWordTimeObject, getPositions,getWordObjectByWordPosition,
  updateSymbolCorrectness, updateWordTime, updateSymbolRows, getIndexes, isAllowedKey,
  isAllowedToMoveToNextSymbolOnMistake, createResultObj
} from "./helpFunctions";
import areObjectValuesSame from "../../helpFunctions/areObjectValuesSame";
import adjustRowsToNewFontData from "../../textFunctions/adjustRowsToNewFontData";
import Timer from "../../accessories/Timer";
import DisplayedRow from "../DisplayedRow/DisplayedRow";
import { FontData, AnimateMistyped } from "../../types/themeTypes";
import { Row, SymbolCorrectness } from "../../types/symbolTypes";
import { ThemeContext } from "../../styles/themeContext";
import { transformTextToSymbolRows } from "../../textFunctions/transformTextToSymbolRows";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import { AllowedMistype, GameStatus, Results } from "../../types/otherTypes";

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
  fontData: FontData;
  lineCount: number;
  rowHeight: number;
}

// TODO try dynamic width?
const useStyles = makeStyles(({ textDisplayTheme }) => ({
  textWindow: {
    boxSizing: "content-box",
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "800px",
    height: ({ lineCount, rowHeight }: MakeStylesProps) => `${rowHeight * lineCount}px`,
    ...textDisplayTheme.offset.display,
    fontFamily: ({ fontData }: MakeStylesProps) => fontData.fontFamily,
    fontSize: ({ fontData }: MakeStylesProps) => fontData.fontSize,
    borderTop: `1px solid ${textDisplayTheme.text.main}`,
    borderBottom: `1px solid ${textDisplayTheme.text.main}`,
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  topHiddenRow: {
    marginTop: ({ rowHeight }: MakeStylesProps) => (
      `-${rowHeight + transformPixelSizeToNumber(textDisplayTheme.offset.display.paddingTop)}px`
    ),
    paddingBottom: textDisplayTheme.offset.display.paddingTop
  },
  bottomHiddenRow: {
    marginTop: "5px"
  }
}));

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
  const classes = useStyles({ fontData, lineCount, rowHeight: cssCalculatedRowHeight });
  const { state: { textDisplayTheme } } = useContext(ThemeContext);
  const wordTimer = useRef(new Timer(2));
  const textDisplayRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
  const fontDataAndTextRef: React.MutableRefObject<FontDataAndTextRef> = useRef({ fontData, text });

  const moveActiveSymbol = (by: -1 | 1) => {
    const newCursorPosition = cursorPosition + by;
    if(newCursorPosition < 0) return; // reached start of text
    if(newCursorPosition >= text.length) { // reached end of text
      setCursorPosition(newCursorPosition);
      return;
    }

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
    if(gameStatus === "start") { // when started typing
      timer.start();
      if(getWordObjectByWordPosition(symbolRows, 0, 0)?.type === "word") {
        wordTimer.current.start();
      }
      setGameStatus("playing");
    }

    if(cursorPosition >= text.length && gameStatus !== "finished") { // when finished
      timer.stop();
      setGameStatus("finished");
      if(cursorPosition === text.length) { // return cursor position to valid index
        setCursorPosition(cursorPosition - 1);
      }
      const resultObj = createResultObj(symbolRows, timer.getTime(), keyStrokeCount);
      setResultObj(resultObj);
    }
  },[cursorPosition, text, keyStrokeCount, timer, symbolRows, gameStatus, setGameStatus, setResultObj])

  // (on keypress === truthy enteredSymbol) check and adjust all the necessary stuff
  useEffect(() => {
    if(!enteredSymbol || gameStatus !== "playing" || !symbolRows.length) return;

    // on Backspace
    if(enteredSymbol === "Backspace") {
      moveActiveSymbol(-1);
    } else
    // on mistyped symbol
    if(enteredSymbol !== text[cursorPosition]) {
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

  // on did mount add keypress event listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const { key } = e;

      // prevent some browser default "onKey" actions (firefox mainly)
      if(FIREFOX_PREVENTED_KEY_DEFAULTS.includes(key.toLowerCase())) {
        e.preventDefault();
      }
      
      setKeyStrokeCount(prevCount => prevCount + 1);
      if(isAllowedKey(key)) {
        setEnteredSymbol(key);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [])

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
      setGameStatus("start");
    }
  }, [cursorPosition, fontData, gameStatus, symbolRows, text, textDisplayTheme.offset, setGameStatus])

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
  }, [restart, setRestart, timer, setGameStatus])

  useEffect(() => {
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
          className={classNames(
            rowIndex === 0 && rowPosition >= LINE_MOVEMENT_MIN_POSITION && classes.topHiddenRow,
            rowIndex === lineCount && rowPosition < LINE_MOVEMENT_MIN_POSITION && classes.bottomHiddenRow,
            rowIndex === lineCount + 1 && classes.bottomHiddenRow
          )}
          fontSize={fontData.fontSize}
          key={row.highestSymbolPosition}
          row={row}
          setRowHeight={shouldSetRowHeight ? setCssCalculatedRowHeight : undefined}
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
