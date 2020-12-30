import { calcWordLength, lineEndersRegexp, Row, SymbolWidths } from "./transformTextToSymbolRows";

export default function adjustRowsToNewFontData(
  previousRows: Row[],
  maxLineLength: number,
  symbolWidths: SymbolWidths
) {
  const spaceLength = calcWordLength(" ", symbolWidths);
  
  let newRows: Row[] = [];
  let currentTextLineLength = 0;
  let currentTextLineSymbolCount = 0;
  let highestSymbolPosition = -1; // for index positioning start at -1
  let currentRowIndex = 0;

  previousRows.forEach(previousRow => {

    previousRow.words.forEach(wordObject => {
      const unsortedWord = wordObject.string;
      const unsortedWordLength = calcWordLength(unsortedWord, symbolWidths);
      
      // If the next word fits into the line length or if it is a line ender...
      if(
        currentTextLineLength + unsortedWordLength + spaceLength < maxLineLength ||
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
