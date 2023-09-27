import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import { calcTypingPrecision, calcTypingSpeedInKeystrokes } from "../../helpFunctions/calcTypigSpeed";
import { FontData, Offset } from "../../types/themeTypes";
import { Row, SymbolCorrectness, SymbolWidths, WordObject } from "../../types/symbolTypes";
import { AllowedMistype, GameStatus, Results, MistypedWordsLog, MistypedWords } from "../../types/otherTypes";
import { secondsToMMSS } from "../../helpFunctions/secondsToMMSS";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import _ from "lodash";

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

// TODO I need to add time of mistype to the mistyped words...
/**
 * 
 * @returns alphabetically sorted array
 */
const extractMistypedWordsAlphabetically = (mistypedWords: WordObject[]): MistypedWords => {
  const timestamp = Date.now(); // ...here is suppose to be the exact mistype time not Date.now()
  
  const wordTimestampsObj = mistypedWords.reduce((accumulator, { string }) => {
    
    if(accumulator[string]) {
      accumulator[string].push(timestamp);
    } else {
      accumulator[string] = [timestamp];
    }

    return accumulator;

  }, {} as {[key: string]: number[]});

  // transform to an array and sort it alphabetically
  return Object.entries(wordTimestampsObj).sort(([keyA,], [keyB,]) => {
    return keyA.localeCompare(keyB, "cz");
  });
};

// TODO back to the original saveMistypedWords?
// export const createMistypedWordsLog = (mistypedWords: WordObject[]) => {
//   return mistypedWords.reduce((accumulator, { string }) => {
//     if(accumulator[string]) {
//       accumulator[string].sumOfMistypes++;
//     } else {
//       accumulator[string] = {
//         timestamps: [Date.now()],
//         sumOfMistypes: 1
//       }
//     }
//     return accumulator;
//   }, {} as MistypedWordsLog)
// };

export const saveMistypedWords = (mistypedWords: WordObject[]) => {
  const localStorageMistypedWords = localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS);
  const savedMistypedWordsLog = localStorageMistypedWords
    ? JSON.parse(localStorageMistypedWords) as MistypedWordsLog
    : null;

  let updatedMistypedWords = extractMistypedWordsAlphabetically(mistypedWords);

  // merge old and new mistype words
  if(savedMistypedWordsLog) {
    updatedMistypedWords = mergeSortedStringArrays(savedMistypedWordsLog["words"], updatedMistypedWords, true);
  }

  const byTime: [number, number][] = []; // [index, lastMistype][]
  const byMistypeCount: [number, number][] = [];  // [index, mistypeCount][]

  for(let i=0; i<updatedMistypedWords.length; i++) {

    const timestamps = updatedMistypedWords[i][1];
    const lastMistype = timestamps[timestamps.length - 1]; 
    byTime.push([i, lastMistype]);
    
    const mistypeCount = updatedMistypedWords[i][1].length;
    byMistypeCount.push([i, mistypeCount]);
  }

  // the sorting has to be consistently ascending for every sort type
  // it ensure a simple use of reverse method for sorting and filtering in Statistic page
  byTime.sort(([, lastMistypeA], [, lastMistypeB]) => lastMistypeA - lastMistypeB);
  byMistypeCount.sort(([, mistypeCountA], [, mistypeCountB]) => mistypeCountA - mistypeCountB);

  const alphabeticalOrder: number[] = [];
  const byTimeOrder: number[] = [];
  const byMistypeCountOrder: number[] = [];
  for(let i=0; i<updatedMistypedWords.length; i++) {
    alphabeticalOrder[i] = i;
    const byTimeOrderIndex = byTime[i][0];
    const byMistypeCountOrderIndex = byMistypeCount[i][0];

    byTimeOrder[byTimeOrderIndex] = i
    byMistypeCountOrder[byMistypeCountOrderIndex] = i
  }

  const newMistypedWordsLog: MistypedWordsLog = {
    words: updatedMistypedWords,
    sorting: {
      alphabetical: alphabeticalOrder,
      byMistypeCount: byMistypeCountOrder,
      byTime: byTimeOrder
    }
  };

  localStorage.setItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS, JSON.stringify(newMistypedWordsLog));

  /**
   * 
   * @param largeArr must be alphabetically sorted
   * @param smallArr must be alphabetically sorted
   * @returns new array
   */
  function mergeSortedStringArrays(largeArr: MistypedWords, smallArr: MistypedWords, areBothArrSorted = false) {
    if(!areBothArrSorted) {
      throw new Error("mergeSortedStringArrays function does not currently support unsorted arrays!");
    }

    const mergedArray:MistypedWords = [];
    let insertionPoint = 0;
    let insertionCount = 0; // it shows arr lenght difference between largeArr and mergedArr

    // Iterate over the small array.
    for (const [nextWord, nextWordTimestamps] of smallArr) {

      // if we reach end of largeArr, just push the rest of smallArr to the mergedArray
      if(insertionPoint > largeArr.length - 1) {
        mergedArray.push([nextWord, nextWordTimestamps]);

        // there's no need to increase the insertionCount anymore
        continue;
      }

      // Use binary search to find the insertion point for the nextWord (and nextWordTimestamps) in the larger array.
      const { index, isEqual } = binarySearch(largeArr, nextWord, insertionPoint);

      insertionPoint = index;
      const startSlicePoint = mergedArray.length - insertionCount;
      const endSlicePoint = insertionPoint + Number(isEqual);

      // Copy alphabetically preceding words from the largeArr up to the slice point.
      // Alphabetical order ensures they won't need to be moved from their indexes.
      mergedArray.push(...largeArr.slice(startSlicePoint, endSlicePoint));

      // If the nextWord already exists in the largeArr (and now also in the merged array), just add its timestamps.
      if(isEqual) {
        const nextWordIndex = insertionPoint + insertionCount;
        mergedArray[nextWordIndex][1].push(...nextWordTimestamps);

      // If nextWord doesn't exist in the large array, push it and its timestapms into the the mergedArray.
      }else {
        mergedArray.push([nextWord, nextWordTimestamps]);
        insertionCount++;
      }
    }

    return mergedArray;
  }
  
  function binarySearch(array: MistypedWords, comparedWord: string , startIndex: number) {
    // Initialize two pointers, one for the start of the array and the other for the end.
    let low = startIndex;
    let high = array.length - 1;

    if(low > high) {
      throw new Error(`Start index {${startIndex}} can't be bigger than array length - 1 {${array.length - 1}}.`);
    }

    // While the low pointer is less than to the high pointer, continue searching.
    while (low < high) {

      // Calculate the midpoint of the array.
      const mid = Math.floor((low + high) / 2);

      // compare the words
      const word = array[mid][0];
      const compareNumber = comparedWord.localeCompare(word, "cz");

      // If the current words are equal
      if (compareNumber === 0) {
        return { index: mid, isEqual: true };
      
      // If the comparedWord should come in front of the word at midpoint, set the high pointer to the midpoint - 1.
      } else if (compareNumber < 0) {
        if(mid - 1 < low) {
          low = mid;
          high = mid;
          break;
        }
        high = mid - 1;

      // If the comparedWord should come after, than the word at the midpoint, set the low pointer to the midpoint + 1.
      } else {
        if(mid + 1 > high) {
          low = mid;
          high = mid;
          break;
        }
        low = mid + 1;
      }
    }

    // If we reach this point, the same word was not found in the array.
    // Determine and return the placement index and equality of the comparedWord.
    const word = array[high][0];
    const compareNumber = comparedWord.localeCompare(word, "cz");

    if(compareNumber === 0) {
        return { index: high, isEqual: true };

    } else if(compareNumber < 0) {
        return { index: high, isEqual: false };
    }

    return { index: high + 1, isEqual: false };
  }

  // todos taken from deprecated V2
  // TODO add last update time for the whole saved object
  // TODO make it async for performance reasons - create state to keep track if it is still computing (and display it where needed)
};
// export const saveMistypedWords = (mistypedWords: WordObject[]) => {
//   const localStorageMistypedWords = localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS);
//   const savedMistypedWords = localStorageMistypedWords
//     ? JSON.parse(localStorageMistypedWords) as MistypedWordsLog
//     : null;
//   const mistypedWordsLog = createMistypedWordsLog(mistypedWords);

//   if(savedMistypedWords) {
//     Object.entries(mistypedWordsLog).forEach(([key, value]) => {
//       if(savedMistypedWords[key]) {
//         savedMistypedWords[key].sumOfMistypes += value.sumOfMistypes;
//         savedMistypedWords[key].timestamps.push(...value.timestamps);
//       } else {
//         savedMistypedWords[key] = value;
//       }
//     })
//     localStorage.setItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS, JSON.stringify(savedMistypedWords));
//     return savedMistypedWords;
//   } else {
//     localStorage.setItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS, JSON.stringify(mistypedWordsLog));
//   }
// };


// TODO delete if V1 is thoroughly tested
// /**
//  * @deprecated
//  */
// export const saveMistypedWordsV2 = (mistypedWords: WordObject[]) => {
//   if(!mistypedWords.length) return;

//   const localStorageMistypedWords = localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS);
//   const savedMistypedWords = localStorageMistypedWords
//     ? JSON.parse(localStorageMistypedWords) as MistypedWordsLogV2
//     : null;
//   const mistypedWordsLog = extractMistypedWords(mistypedWords);

//   let mistypedWordsMap: Map<string, number[]> = new Map();
//   if(savedMistypedWords) {
//     const mistypedWordsArr: [string, number[]][] = savedMistypedWords
//       .map(({ word, timestamps }) => [word, timestamps]);
//     mistypedWordsMap = new Map(mistypedWordsArr);
    
//     Object.entries(mistypedWordsLog).forEach(([key, value]) => {
//       const timestamps = mistypedWordsMap.get(key) ?? [];
//       timestamps.push(...value);
//       mistypedWordsMap.set(key, timestamps);
//     });
    
//   } else {
//     mistypedWordsMap = new Map(Object.entries(mistypedWordsLog));
//   }

//   const newSavedMistypedWordsArr = Array.from(mistypedWordsMap);
//   const alphabetical: [number, string][] = []; // [index, word][]
//   const byTime: [number, number][] = []; // [index, lastMistype][]
//   const byMistypeCount: [number, number][] = [];  // [index, mistypeCount][]

//   for(let i=0; i<newSavedMistypedWordsArr.length; i++) {
//     const word = newSavedMistypedWordsArr[i][0];
//     alphabetical.push([i, word]);

//     const timestamps = newSavedMistypedWordsArr[i][1];
//     const lastMistype = timestamps[timestamps.length - 1]; 
//     byTime.push([i, lastMistype]);
    
//     const mistypeCount = newSavedMistypedWordsArr[i][1].length;
//     byMistypeCount.push([i, mistypeCount]);
//   }

//   alphabetical.sort(([, wordA], [, wordB]) => wordA.localeCompare(wordB, "cz"));
//   byTime.sort(([, lastMistypeA], [, lastMistypeB]) => lastMistypeA - lastMistypeB);
//   byMistypeCount.sort(([, mistypeCountA], [, mistypeCountB]) => mistypeCountA - mistypeCountB);

//   const alphabeticalOrder: number[] = [];
//   const byTimeOrder: number[] = [];
//   const byMistypeCountOrder: number[] = [];
//   for(let i=0; i<newSavedMistypedWordsArr.length; i++) {
//     const alphabeticalOrderIndex = alphabetical[i][0];
//     const byTimeOrderIndex = byTime[i][0];
//     const byMistypeCountOrderIndex = byMistypeCount[i][0];

//     alphabeticalOrder[alphabeticalOrderIndex] = i
//     byTimeOrder[byTimeOrderIndex] = i
//     byMistypeCountOrder[byMistypeCountOrderIndex] = i
//   }

//   const newMistypedWordsLog: MistypedWordsLogV2 = newSavedMistypedWordsArr.map(([word, timestamps], i) => {
//     return {
//       word,
//       timestamps,
//       sorting: {
//         alphabetical: alphabeticalOrder[i],
//         byTime: byTimeOrder[i],
//         byMistypeCount: byMistypeCountOrder[i]
//       }
//     }
//   });

//   console.log({ newMistypedWordsLog, alphabetical })
//   localStorage.setItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS, JSON.stringify(newMistypedWordsLog));
// };

export const getLastSymbol = (symbolRows: Row[]) => {
  const lastWords = _.last(symbolRows)?.words;
  const lastSymbols = lastWords && _.last(lastWords)?.symbols;
  return lastSymbols && _.last(lastSymbols);
};
