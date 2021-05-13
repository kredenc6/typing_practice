import { Row } from "../types/symbolTypes";

const PENALTY_COEFFICIENT = 10;

// TODO not standartized calculations, see: 
// https://cs.wikipedia.org/wiki/Psac%C3%AD_stroj#:~:text=Rychlost%20psan%C3%AD%20se%20uv%C3%A1d%C3%AD%20v,d%C4%9Bl%C3%AD%20dobou%20psan%C3%AD%20v%20minut%C3%A1ch
// https://www.100utils.com/how-to-calculate-typing-speed-wpm-and-accuracy/

export const calcTypingSpeedInKeystrokes = (seconds: number, keyStrokeCount: number, mistakeCount: number) => {
  if(!seconds) return 0;
  return Math.round((keyStrokeCount - mistakeCount * PENALTY_COEFFICIENT) / seconds * 60);
};
export const calcTypingSpeedInKeystrokesV2 = (seconds: number, symbolRows: Row[]) => {
  if(!seconds) return 0;
  let textBestKeyStrokeCount = 0;
  let uncorrectedMistakeCount = 0;
  symbolRows.forEach(({ words }) =>
    words.forEach(({ symbols }) =>
      symbols.forEach(({ keyStrokeValue, correctness }) => {
        textBestKeyStrokeCount += keyStrokeValue;
        if(correctness === "mistyped") {
          uncorrectedMistakeCount++;
        }
      })
    )
  );

  return Math.round((textBestKeyStrokeCount - uncorrectedMistakeCount * PENALTY_COEFFICIENT) / seconds * 60);
};

export const calcTypingPrecision = (keyStrokeCount: number, mistakeCount: number) => {
  const exactPercentage = 100 - mistakeCount * 100 / keyStrokeCount;
  
  const DECIMAL = 10;
  return Math.round(exactPercentage * DECIMAL) / DECIMAL;
};
