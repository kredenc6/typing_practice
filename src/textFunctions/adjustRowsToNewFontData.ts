import { calcWordLength, lineEndersRegexp } from "./transformTextToSymbolRows";
import { Row, SymbolWidths } from "../types/symbolTypes";
import { getWordObjectByWordPosition } from "../components/TextDisplay/helpFunctions";

export default function adjustRowsToNewFontData(
  previousRows: Row[],
  maxLineLength: number,
  symbolWidths: SymbolWidths
) {
  const spaceLength = calcWordLength(" ", symbolWidths);
  console.log("spaceLength")
  console.dir(spaceLength)
  
  let newRows: Row[] = [];
  let currentTextLineLength = 0;
  let currentTextLineSymbolCount = 0;
  let highestSymbolPosition = -1; // for index positioning start at -1
  let currentRowIndex = 0;

  previousRows.forEach(previousRow => {

    previousRow.words.forEach(wordObject => {
      // there can be several consecutive line enders - calc their length so we don't overflow the row
      const calcLineEnderLengths = (nextWordPosition: number, lineEnderLengths = 0): number => {
        const nextWord = getWordObjectByWordPosition(previousRows, nextWordPosition);
        if(nextWord && lineEndersRegexp.test(nextWord.string)) {
          lineEnderLengths += calcWordLength(nextWord.string, symbolWidths);
          return calcLineEnderLengths(nextWordPosition + 1, lineEnderLengths);
        } else {
          return lineEnderLengths;
        }
      };
      const unsortedWord = wordObject.string;
      const unsortedWordLength = calcWordLength(unsortedWord, symbolWidths);
      const lineEndersLengths = calcLineEnderLengths(wordObject.wordPosition + 1);
      
      // If the next word fits into the line length or if it is a line ender...
      if(
        currentTextLineLength + unsortedWordLength + lineEndersLengths < maxLineLength ||
        lineEndersRegexp.test(unsortedWord)
      ) {
        currentTextLineLength += unsortedWordLength;
        currentTextLineSymbolCount += unsortedWord.length;
        highestSymbolPosition += unsortedWord.length;
  
        const sortedWordObjects = newRows[currentRowIndex] ? newRows[currentRowIndex].words : [];
        newRows[currentRowIndex] = { // ...put it in to the line...
          highestSymbolPosition,
          symbolCount: currentTextLineSymbolCount,
          words: [ ...sortedWordObjects, wordObject ]
        };
      } else { // ...otherwise create a new line with the word.
        currentTextLineLength = unsortedWordLength;
        currentTextLineSymbolCount = unsortedWord.length;
        highestSymbolPosition += unsortedWord.length;
        currentRowIndex++;

        newRows[currentRowIndex] = {
          highestSymbolPosition,
          symbolCount: currentTextLineSymbolCount,
          words: [wordObject]
        };
      }
    });
  });
  
  return newRows;
}
