import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import { Row } from "../../textFunctions/transformTextToSymbolRows";

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
