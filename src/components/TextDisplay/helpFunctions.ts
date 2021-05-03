import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import Timer from "../../accessories/Timer";
import { FontData, Offset } from "../../types/themeTypes";
import { Row, SymbolCorrectness, SymbolWidths } from "../../types/symbolTypes";

interface WordTimeObject {
  rowPosition: number;
  wordPosition: number;
  wordTime: number;
}

export const updateSymbolCorrectness = (
  symbolRows: Row[], rowPosition: number, textPosition: number, correctness: SymbolCorrectness
): Row => {
  const row = symbolRows[rowPosition];
  const { wordIndex, symbolIndex } = getIndexes(textPosition, symbolRows);

  const updatedWords = [...row.words];
  updatedWords[wordIndex].wasCorrect = false;
  updatedWords[wordIndex].symbols[symbolIndex].correctness = correctness;

  return { ...row, words: updatedWords };
};

export const getWordObject = (symbolRows: Row[], rowPosition: number, wordPosition: number) => {
  const activeWordObject = symbolRows[rowPosition].words.find(
    ({ wordPosition: iteratedWordPosition }) => wordPosition === iteratedWordPosition);
  return activeWordObject || null;
};

export const updateRowWithWordTime = (row: Row, wordPosition: number, wordTime: number): Row => {
  const updatedWords = row.words.map(word => {
    if(word.wordPosition === wordPosition) {
      return {...word, typedSpeed: wordTime };
    }
    return word;
  });

  return { ...row, words: updatedWords };
};

export const updateSymbolRows = (setSymbolRows: React.Dispatch<React.SetStateAction<Row[]>>, updatedRow: Row, updatedRowIndex: number) => {
  setSymbolRows(prev => prev.map((row, i) => {
    if(i === updatedRowIndex) {
      return updatedRow;
    }
    return row;
  }));
};

export const collectMistypedWords = (symbolRows: Row[]) => {
  const WORD_MIN_LENGTH_FOR_MISTYPED = 3;

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
};

export const collectMistypedSymbolPositions = (symbolRows: Row[]) => {
  return symbolRows.reduce((mistypedSymbolPositions, row) => {
    const mistypedSymbolsInWords = row.words.filter(({ wasCorrect }) => !wasCorrect)
      .reduce((mistypedSymbols, wordObject) => {

        const mistypedSymbolsInWordObject = wordObject.symbols.reduce((mistypedSymbols, symbol) => {
          if(symbol.correctness === "mistyped") {
            return [...mistypedSymbols, symbol.symbolPosition];
          }
          return mistypedSymbols;
        }, [] as number[]);

        return [...mistypedSymbols, ...mistypedSymbolsInWordObject];
      }, [] as number[]);

    return [...mistypedSymbolPositions, ...mistypedSymbolsInWords];
  }, [] as number[]);
};

export const calculateDisplayTextInnerWidth = (width: string, paddingLeft: string, paddingRight: string) => {
  return (
    transformPixelSizeToNumber(width) -
    transformPixelSizeToNumber(paddingLeft) -
    transformPixelSizeToNumber(paddingRight)
  );
};

export const getPositions = (cursorPosition: number, symbolRows: Row[], rowStartPosition = 0) => {
  const result = {
    rowPosition: -1,
    wordPosition: -1
  };

  if(!symbolRows.length) {
    return result;
  }
  
  for(let i=rowStartPosition; i<symbolRows.length; i++) {
    if(cursorPosition <= symbolRows[i].highestSymbolPosition) {
      result.rowPosition = i;
      break;
    }
  }

  const wordObject = symbolRows[result.rowPosition].words.find(({ symbols }) => {
    return symbols.some(({ symbolPosition }) => symbolPosition === cursorPosition);
  });

  if(!wordObject) {
    console.error("Failed to get word position!");
    return result;
  } else {
    result.wordPosition = wordObject.wordPosition;
  }
  return result;
};

export const getWordTimeObject = (wordTimer: Timer, symbolRows: Row[], rowPosition: number, wordPosition: number ) => {
  if(!symbolRows.length) {
    return null;
  }

  let tempRowPosition = rowPosition;
  let wordObject = getWordObject(symbolRows, rowPosition, wordPosition);

  if(!wordObject && tempRowPosition > 0) { // it's possible we've already moved to the next row - check the previous one
    tempRowPosition -= 1;
    wordObject = getWordObject(symbolRows, tempRowPosition, wordPosition);
  }
  if(!wordObject) {
    throw new Error("Did not get the needed word object.");
  }

  if(wordTimer.isRunning && wordObject.type !== "word") {
    wordTimer.stop();
    const wordTime = wordTimer.getTime();
    const previousWordPosition = wordObject.wordPosition - 1;
    
    return {
      rowPosition: tempRowPosition,
      wordPosition: previousWordPosition,
      wordTime
    };
  }

  if(!wordTimer.isRunning && wordObject.type === "word") {
    wordTimer.start();
  }
  return null;
}

export const updateWordTime =
(
  symbolRows: Row[],
  setSymbolRows: React.Dispatch<React.SetStateAction<Row[]>>,
  wordTimeOject: WordTimeObject
) => {
  const { rowPosition, wordPosition, wordTime } = wordTimeOject;
  
  const updatedRow = updateRowWithWordTime(symbolRows[rowPosition], wordPosition, wordTime);
  updateSymbolRows(setSymbolRows, updatedRow, rowPosition);
}

export const createSymbolWidthsObject = (
  symbolOffset: Offset["symbol"],
  symbolWidths: FontData["symbolWidths"]
): SymbolWidths => {
  const { marginRight, paddingLeft, paddingRight } = symbolOffset;

  return {
    marginX: transformPixelSizeToNumber(marginRight), // left margin is not used atm
    paddingX: transformPixelSizeToNumber(paddingLeft) + transformPixelSizeToNumber(paddingRight),
    widths: symbolWidths
  }
};

export const getIndexes = (cursorPosition: number, symbolRows: Row[]) => {
  const result = {
    rowIndex: -1,
    wordIndex: -1,
    symbolIndex: -1
  };

  if(!symbolRows.length) {
    return result;
  }
  
  for(let i=0; i<symbolRows.length; i++) {
    if(cursorPosition <= symbolRows[i].highestSymbolPosition) {
      result.rowIndex = i;
      break;
    }
  }

  result.wordIndex = symbolRows[result.rowIndex].words.findIndex(({ symbols }) => {
    return symbols.some(({ symbolPosition }) => symbolPosition === cursorPosition);
  });

  result.symbolIndex = symbolRows[result.rowIndex].words[result.wordIndex].symbols
    .findIndex(({ symbolPosition }) => symbolPosition === cursorPosition);

  return result;
};

export const isAllowedKey = (key: string) => {
  return (
    key.length === 1 ||
    key === "Backspace"
  );
};

const getPreviousSymbol = (symbolPosition: number, symbolRows: Row[]) => {
  let { rowIndex, symbolIndex, wordIndex } = getIndexes(symbolPosition, symbolRows);
  if(!symbolIndex && !wordIndex && !rowIndex) {
    return null;
  }
  if(symbolIndex === 0 && wordIndex === 0) {
    rowIndex -= 1;
    wordIndex = symbolRows[rowIndex].words.length - 1;
    symbolIndex = symbolRows[rowIndex].words[wordIndex].symbols.length - 1;
  } else if(symbolIndex === 0) {
    wordIndex -= 1;
    symbolIndex = symbolRows[rowIndex].words[wordIndex].symbols.length - 1;
  } else {
    symbolIndex -= 1;
  }

  return symbolRows[rowIndex].words[wordIndex].symbols[symbolIndex];
};

export const isAllowedToMoveToNextSymbolOnMistake = (
  symbolRows: Row[], textPosition: number, allowedMistypeCount: number
) => {
  for(let stepper = 0; allowedMistypeCount > 0; allowedMistypeCount--) {
    const previousSymbol = getPreviousSymbol(textPosition - stepper, symbolRows);
    if(!previousSymbol || previousSymbol.correctness !== "mistyped") {
      return true;
    }
    stepper++;
  }

  return false;
};
