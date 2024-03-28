import { type Row } from "../types/symbolTypes";

const PENALTY_COEFFICIENT = 10;

export const calcTypingSpeedInKeystrokes = (seconds: number, symbolRows: Row[]) => {
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

  const typingSpeed = Math.round((textBestKeyStrokeCount - uncorrectedMistakeCount * PENALTY_COEFFICIENT) / seconds * 60);
  return Math.max(0, typingSpeed);
};

export const calcTypingPrecision = (keyStrokeCount: number, mistakeCount: number) => {
  const exactPercentage = 100 - mistakeCount * 100 / keyStrokeCount;
  
  const DECIMAL = 10;
  return Math.round(exactPercentage * DECIMAL) / DECIMAL;
};
