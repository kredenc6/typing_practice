import { type Row, type SymbolObject, type SymbolWidths, type WordObject, type WordType } from "../types/symbolTypes";

const splitterRegexp = /[0-9\p{L}']+|\s+|[^0-9\p{L}'\s]/giu; // numbers, letters or apostrophe | whitespace | nothing of the previous
export const lineEndersRegexp = /[ .,!?;:)\]}]|\n+/;


const sortTextToRows = (text: string, maxLineLength: number, symbolWidths: SymbolWidths) => {
  const splittedText = text.match(splitterRegexp) as string[];
  
  // there can be several consecutive line enders - calc their length so we don't overflow the row
  const calcLineEnderLengths = (nextTextIndex: number, lineEnderLengths = 0): number => {
    const nextText = splittedText[nextTextIndex];
    if(nextText && lineEndersRegexp.test(nextText)) {
      lineEnderLengths += calcWordLength(nextText, symbolWidths);
      return calcLineEnderLengths(nextTextIndex + 1, lineEnderLengths);
    } else {
      return lineEnderLengths;
    }
  };
  
  let currentTextLineLength = 0;
  const rows = splittedText.reduce((textLines, unsortedWord, i) => {
    const currentTextLineNumber = textLines.length - 1;
    const unsortedWordLength = calcWordLength(unsortedWord, symbolWidths);
    const lineEnderLengths = calcLineEnderLengths(i + 1, 0);

    // If the next word fits into the line length or if it is a line ender...
    if(
      currentTextLineLength + unsortedWordLength + lineEnderLengths < maxLineLength ||
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
      const wordInSymbolObjects: SymbolObject[] = [];
      
      for(const symbol of word) {
        wordInSymbolObjects.push({
          symbol,
          symbolPosition: symbolPosition,
          correctness: "pending",
          keyStrokeValue: determineSymbolKeyStrokeValue(symbolPosition, text)
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
    }
    
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

// TODO This is a very simple solution returning a lot of inaccurate values on CAPS/shift edge cases. It's also not considering english keybord layout.
// TODO Idealy this should return the least possible key stroke count concerning nearby symbols, holding left/right shift, etc.
// https://cs.wikipedia.org/wiki/Psac%C3%AD_stroj#:~:text=Rychlost%20psan%C3%AD%20se%20uv%C3%A1d%C3%AD%20v,d%C4%9Bl%C3%AD%20dobou%20psan%C3%AD%20v%20minut%C3%A1ch
// https://www.100utils.com/how-to-calculate-typing-speed-wpm-and-accuracy/
const determineSymbolKeyStrokeValue = (position: number, text: string) => {
  const CAPITAL_LETTERS_VALUE_2 = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G",
    "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"
  ];
  const CAPITAL_LETTERS_VALUE_3 = ["Ý", "Á", "Í", "É", "Ú", "Ó"]; // Ó has value 2 when CAPS!!
  const CAPITAL_LETTERS_VALUE_4 = ["Č", "Ď", "Ř", "Š", "Ť", "Ž", "Ň", "Ě", "Ů"]; // Ď, Ť, Ň has value 3 when CAPS!!
  const CAPITAL_LETTERS = [
    ...CAPITAL_LETTERS_VALUE_2, ...CAPITAL_LETTERS_VALUE_3, ...CAPITAL_LETTERS_VALUE_4
  ];

  const STROKE_VALUE_2 = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "%", "/", "(", "'", '"',
    "!", "?", ":", "_", "ó" 
  ];
  const STROKE_VALUE_3 = ["°", "ď", "ť", "ň"];

  const symbol = text[position];
  // capital letters
  if(CAPITAL_LETTERS.includes(symbol)) {
    const previousSymbol = text[position - 1];
    const nextSymbol = text[position + 1];
    // with CAPS
    if(CAPITAL_LETTERS.includes(previousSymbol) && CAPITAL_LETTERS.includes(nextSymbol)) {
      if(symbol === "Ď" || symbol === "Ť" || symbol === "Ň") {
        return 3;
      }
      if(symbol === "Ó") {
        return 2;
      }
      return 1;
    }
    // without CAPS
    if(CAPITAL_LETTERS_VALUE_4.includes(symbol)) {
      return 4;
    }
    if(CAPITAL_LETTERS_VALUE_3.includes(symbol)) {
      return 3;
    }
    return 2;
  }
  // all symbols except capital letters
  if(STROKE_VALUE_3.includes(symbol)) {
    return 3;
  }
  if(STROKE_VALUE_2.includes(symbol)) {
    return 2;
  }
  return 1;
};
