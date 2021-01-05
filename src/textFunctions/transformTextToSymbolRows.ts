import { FontData } from "../types/types";

type WordType = "word" | "whitespace" | "other";

export type SymbolObject = {
  symbol: string;
  symbolPosition: number;
  wasCorrect: boolean;
};

export type WordObject = {
  string: string;
  symbols: SymbolObject[];
  type: WordType;
  wordPosition: number;
  typedSpeed: number;
  wasCorrect: boolean;
}

export type Row = {
  highestSymbolPosition: number;
  symbolCount: number;
  words: WordObject[];
};

export type SymbolWidths = {
  widths: FontData["symbolWidths"];
  marginX: number;
  paddingX: number;
};

const splitterRegexp = /[0-9\p{L}']+|\s+|[^0-9\p{L}'\s+]/giu; // numbers, letters or apostrophe | whitespace | nothing of the previous
export const lineEndersRegexp = /[ .,!?;:)\]}]|\n+/;


const sortTextToRows = (text: string, maxLineLength: number, symbolWidths: SymbolWidths) => {
  const splittedText = text.match(splitterRegexp) as string[];
  const spaceLength = calcWordLength(" ", symbolWidths);
  
  let currentTextLineLength = 0;
  const rows = splittedText.reduce((textLines, unsortedWord) => {
    const currentTextLineNumber = textLines.length - 1;
    const unsortedWordLength = calcWordLength(unsortedWord, symbolWidths);

    // If the next word fits into the line length or if it is a line ender...
    if(
      currentTextLineLength + unsortedWordLength + spaceLength < maxLineLength ||
      lineEndersRegexp.test(unsortedWord)) {

      return textLines.map((textLine, i) => { // ...put it in to the line...
        if(i === currentTextLineNumber) {
          currentTextLineLength += unsortedWordLength;
          return [...textLine, unsortedWord];
        }
        return textLine;
      });
    }

    currentTextLineLength = unsortedWordLength;
    return [...textLines, [unsortedWord]]; // ...otherwise create a new line with the word.
  }, [[]] as string[][]);
  
  return rows;
};

export const calcWordLength = (word: string, symbolWidths: SymbolWidths) => {
  const { marginX, paddingX, widths } = symbolWidths;
  let wordLength = 0;

  for(const symbol of word) {
    if(symbol === " ") {
      wordLength += widths["space"] + marginX + paddingX;
    } else if(symbol === "#") {
      wordLength += widths["hash"] + marginX + paddingX;
    } else if(symbol === `"`) {
      wordLength += widths["doubleQuote"] + marginX + paddingX;
    } else {
      wordLength += widths[symbol] + marginX + paddingX;
    }
  }
  return wordLength;
};

export const transformTextToSymbolRows =
(
  text: string,
  lineLength: number,
  symbolWidths: SymbolWidths
) => {
  if(!text) return [];
  const rowArray: Row[] = [];
  let symbolPosition = 0;
  let wordPosition = 0;
  const textRows = sortTextToRows(text, lineLength, symbolWidths);

  for(const row of textRows) {
    let symbolsInRowCount = 0;
    const words: WordObject[] = [];
    
    for(const word of row) {
      let wordInSymbolObjects: SymbolObject[] = [];
      
      for(const symbol of word) {
        wordInSymbolObjects.push({
          symbol,
          symbolPosition: symbolPosition,
          wasCorrect: true
        });
        
        symbolPosition++;
        symbolsInRowCount++;
      }

      const wordObject: WordObject = {
        type: determineWordType(word),
        string: word,
        symbols: wordInSymbolObjects,
        wordPosition,
        typedSpeed: -1,
        wasCorrect: true
      };

      words.push(wordObject);
      wordPosition++;
    };
    
    rowArray.push({
      highestSymbolPosition: symbolPosition - 1,
      symbolCount: symbolsInRowCount,
      words
    });
  }
  return rowArray;
};


const determineWordType = (word: string): WordType => {
  if(/\s+/.test(word)) {
    return "whitespace";
  }
  if(/[0-9\p{L}']+/giu.test(word)) {
    return "word";
  }
  return "other";
};
