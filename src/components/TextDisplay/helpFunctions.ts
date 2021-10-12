//TODO this is a copy of TradeDisplay component helpFunctions - when finished delete the old ones

import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import { calcTypingPrecision, calcTypingSpeedInKeystrokes } from "../../helpFunctions/calcTypigSpeed";
import { FontData, Offset } from "../../types/themeTypes";
import { Row, SymbolCorrectness, SymbolWidths, WordObject } from "../../types/symbolTypes";
import { AllowedMistype, GameStatus, Results } from "../../types/otherTypes";
import { secondsToMMSS } from "../../helpFunctions/secondsToMMSS";

export const LOCAL_STORAGE_KEY = "typingPractice_mistypedWords";

export const updateSymbolCorrectness = (
  symbolRows: Row[], rowPosition: number, textPosition: number, correctness: SymbolCorrectness
): Row => {
  const row = symbolRows[rowPosition];
  const { wordIndex, symbolIndex } = getIndexes(textPosition, symbolRows);

  const updatedWords = [...row.words];
  if(correctness === "mistyped" || correctness === "corrected") {
    updatedWords[wordIndex].wasCorrect = false;
  }
  updatedWords[wordIndex].symbols[symbolIndex].correctness = correctness;

  return { ...row, words: updatedWords };
};

export const getMaxWordPosition = (symbolRows: Row[]) => {
  const lastRowWordsLength = symbolRows[symbolRows.length - 1].words.length;
  return symbolRows[symbolRows.length - 1].words[lastRowWordsLength - 1].wordPosition;
};

export const getWordObjectByWordPosition = (symbolRows: Row[], wordPosition: number, rowIndex?: number) => {
  let foundWordObjIndex = -1;

  if(rowIndex !== undefined) {
    foundWordObjIndex = symbolRows[rowIndex].words.findIndex(wordObj => {
      return wordObj.wordPosition === wordPosition;
    });
  } else {
    for(rowIndex = 0; rowIndex < symbolRows.length; rowIndex++) {
      foundWordObjIndex = symbolRows[rowIndex].words.findIndex(wordObj => {
        return wordObj.wordPosition === wordPosition;
      });
  
      if(foundWordObjIndex !== -1) break;
    }
  }

  if(foundWordObjIndex === -1) {
    throw new Error(`Cound not find the desired word at wordPosition: ${wordPosition}, rowPosition: ${rowIndex}.`);
  }

  return {
    obj: symbolRows[rowIndex].words[foundWordObjIndex],
    rowPosition: rowIndex,
    wordRowIndex: foundWordObjIndex
  }
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

export const collectSymbolPositionsByCorrectness = (symbolRows: Row[], correctness: SymbolCorrectness) => {
  return symbolRows.reduce((symbolPositions, row) => {
    const symbolsInWords = row.words
      .reduce((symbols, wordObject) => {

        const symbolsInWordObject = wordObject.symbols.reduce((symbols, symbol) => {
          if(symbol.correctness === correctness) {
            return [...symbols, symbol.symbolPosition];
          }
          return symbols;
        }, [] as number[]);

        return [...symbols, ...symbolsInWordObject];
      }, [] as number[]);

    return [...symbolPositions, ...symbolsInWords];
  }, [] as number[]);
};
// export const collectMistypedSymbolPositions = (symbolRows: Row[]) => {
//   return symbolRows.reduce((mistypedSymbolPositions, row) => {
//     const mistypedSymbolsInWords = row.words
//       .filter(({ wasCorrect }) => !wasCorrect)
//       .reduce((mistypedSymbols, wordObject) => {

//         const mistypedSymbolsInWordObject = wordObject.symbols.reduce((mistypedSymbols, symbol) => {
//           if(symbol.correctness === "mistyped") {
//             return [...mistypedSymbols, symbol.symbolPosition];
//           }
//           return mistypedSymbols;
//         }, [] as number[]);

//         return [...mistypedSymbols, ...mistypedSymbolsInWordObject];
//       }, [] as number[]);

//     return [...mistypedSymbolPositions, ...mistypedSymbolsInWords];
//   }, [] as number[]);
// };

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

export const getWordProp = <T extends keyof WordObject>(
  symbolRows: Row[],
  wordProp: T,
  wordPosition: number,
  rowPosition?: number
) => {
  const { obj: wordObj } = getWordObjectByWordPosition(symbolRows, wordPosition, rowPosition);
  return wordObj[wordProp];
};

export const updateWordProp = <K extends keyof WordObject>(
  symbolRows: Row[],
  setSymbolRows: React.Dispatch<React.SetStateAction<Row[]>>,
  wordObjProp: K,
  wordInfo: { value: WordObject[K]; wordPosition: number; rowPosition?: number; }
) => {
  const { rowPosition, wordPosition, value } = wordInfo;
  const {
    wordRowIndex,
    rowPosition: rowIndex
  } = getWordObjectByWordPosition(symbolRows, wordPosition, rowPosition);

  setSymbolRows( prev => {
    const newRows = [ ...prev ];
    newRows[rowIndex].words[wordRowIndex][wordObjProp] = value;
    return newRows;
  });
};

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

// export const getNextSymbol = (symbolPosition: number, symbolRows: Row[]) => {
//   let { rowIndex, symbolIndex, wordIndex } = getIndexes(symbolPosition, symbolRows);
//   if(!symbolIndex && !wordIndex && !rowIndex) {
//     return null;
//   }
//   symbolIndex++;
//   if(symbolRows[rowIndex].words[wordIndex].symbols[symbolIndex] === undefined)

//   if(symbolIndex === 0 && wordIndex === 0) {
//     rowIndex -= 1;
//     wordIndex = symbolRows[rowIndex].words.length - 1;
//     symbolIndex = symbolRows[rowIndex].words[wordIndex].symbols.length - 1;
//   } else if(symbolIndex === 0) {
//     wordIndex -= 1;
//     symbolIndex = symbolRows[rowIndex].words[wordIndex].symbols.length - 1;
//   } else {
//     symbolIndex -= 1;
//   }

//   return symbolRows[rowIndex].words[wordIndex].symbols[symbolIndex];
// };

export const isAllowedToMoveToNextSymbolOnMistake = (
  symbolRows: Row[], textPosition: number, allowedMistype: AllowedMistype
) => {
  if(!allowedMistype.isAllowed) {
    return true;
  }

  let allowedMistypeCount = allowedMistype.count;
  for(let stepper = 0; allowedMistypeCount > 0; allowedMistypeCount--) {
    const previousSymbol = getPreviousSymbol(textPosition - stepper, symbolRows);
    if(!previousSymbol || previousSymbol.correctness !== "mistyped") {
      return true;
    }
    stepper++;
  }

  return false;
};

export const createPartialResultObj = (
  symbolRows: Row[], time: number, keyStrokeCount: number
): Pick<Results, "mistypedWords" | "typingSpeed" | "wpm" | "precision" | "time"> => {
  const mistypedWords = collectMistypedWords(symbolRows);
  const mistakeCount = collectSymbolPositionsByCorrectness(symbolRows, "mistyped").length;
  const correctedCount = collectSymbolPositionsByCorrectness(symbolRows, "corrected").length;
  const errorCount = mistakeCount + correctedCount;

  const typingSpeed = calcTypingSpeedInKeystrokes(time, symbolRows);
  const wpm = Math.round(typingSpeed / 5);

  return {
    mistypedWords,
    typingSpeed,
    wpm,
    precision: calcTypingPrecision(keyStrokeCount, errorCount),
    time: secondsToMMSS(time),
  };
};

export const isPlayingGameStatus = (gameStatus: GameStatus) => {
  return ["playing", "selfType"].includes(gameStatus)
};

type MistypedWordsLog = {
  [propName: string]: {
    timestamps: number[];
    sumOfMistypes: number;
  }
}

export const createMistypedWordsLog = (mistypedWords: WordObject[]) => {
  return mistypedWords.reduce((accumulator, { string }) => {
    if(accumulator[string]) {
      accumulator[string].sumOfMistypes++;
    } else {
      accumulator[string] = {
        timestamps: [Date.now()],
        sumOfMistypes: 1
      }
    }
    return accumulator;
  }, {} as MistypedWordsLog)
};

export const saveMistypedWords = (mistypedWords: WordObject[]) => {
  const localStorageMistypedWords = localStorage.getItem(LOCAL_STORAGE_KEY);
  const savedMistypedWords = localStorageMistypedWords
    ? JSON.parse(localStorageMistypedWords) as MistypedWordsLog
    : null;
  const mistypedWordsLog = createMistypedWordsLog(mistypedWords);

  if(savedMistypedWords) {
    Object.entries(mistypedWordsLog).forEach(([key, value]) => {
      if(savedMistypedWords[key]) {
        savedMistypedWords[key].sumOfMistypes += value.sumOfMistypes;
        savedMistypedWords[key].timestamps.push(...value.timestamps);
      } else {
        savedMistypedWords[key] = value;
      }
    })
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedMistypedWords));
    return savedMistypedWords;
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mistypedWordsLog));
  }
};
