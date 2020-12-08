import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import { Row } from "../../textFunctions/transformTextToSymbolRows";
import Timer from "../../accessories/Timer";

interface WordTimeObject {
  rowPosition: number;
  wordPosition: number;
  wordTime: number;
}

export const updateRowWithMistype = (symbolRows: Row[], rowPosition: number, wordPosition: number, textPosition: number) => {
  const row = symbolRows[rowPosition];
  const wordPositionItTheRow =
    row.words.findIndex(({ wordPosition: comparedWordPosition }) => comparedWordPosition === wordPosition);
  const symbolPositionInTheWord =
    row.words[wordPositionItTheRow].symbols.findIndex(({ symbolPosition }) => symbolPosition === textPosition);

  const updatedWords = [...row.words];
  updatedWords[wordPositionItTheRow].wasCorrect = false;
  updatedWords[wordPositionItTheRow].symbols[symbolPositionInTheWord].wasCorrect = false;

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
          if(!symbol.wasCorrect) {
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
  const OVERREACH_REDUNDANCY_MULTIPLIER = 2;

  return transformPixelSizeToNumber(width) -
    transformPixelSizeToNumber(paddingLeft) -
    // line-enders like comas or dots and spaces after them are allowed to overreach the inner width
    transformPixelSizeToNumber(paddingRight) * OVERREACH_REDUNDANCY_MULTIPLIER;
};

export const getPositions = (cursorPosition: number, symbolRows: Row[], rowStartPosition = 0) => {
  if(!symbolRows.length) {
    return {
      rowPosition: 0,
      wordPosition: 0
    }
  }
  
  let rowPosition = rowStartPosition;
  for(let i=rowStartPosition; i<symbolRows.length; i++) {
    if(cursorPosition <= symbolRows[i].highestSymbolPosition) {
      rowPosition = i;
      break;
    }
  }

  const wordObject = symbolRows[rowPosition].words.find(({ symbols }) => {
    return symbols.some(({ symbolPosition }) => symbolPosition === cursorPosition);
  });

  if(!wordObject) {
    throw new Error("Failed to get word position!");
  }

  return {
    rowPosition,
    wordPosition: wordObject.wordPosition
  };
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