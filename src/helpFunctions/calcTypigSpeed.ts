const SYMBOL_KEYSTROKES = {
  "0": 2,
  "1": 2,
  "2": 2,
  "3": 2,
  "4": 2,
  "5": 2,
  "6": 2,
  "7": 2,
  "8": 2,
  "9": 2,
  "a": 1,
  "b": 1,
  "c": 1,
  "d": 1,
  "e": 1,
  "f": 1,
  "h": 1,
  "g": 1,
  "i": 1,
  "j": 1,
  "k": 1,
  "l": 1,
  "m": 1,
  "n": 1,
  "o": 1,
  "p": 1,
  "q": 1,
  "r": 1,
  "s": 1,
  "t": 1,
  "u": 1,
  "v": 1,
  "w": 1,
  "x": 1,
  "y": 1,
  "z": 1,
  "A": 2,
  "B": 2,
  "C": 2,
  "D": 2,
  "E": 2,
  "F": 2,
  "G": 2,
  "H": 2,
  "I": 2,
  "J": 2,
  "K": 2,
  "L": 2,
  "M": 2,
  "N": 2,
  "O": 2,
  "P": 2,
  "Q": 2,
  "R": 2,
  "S": 2,
  "T": 2,
  "U": 2,
  "V": 2,
  "W": 2,
  "X": 2,
  "Y": 2,
  "Z": 2,
  " ": 1,
  "°": 2,
  "~": 2,
  "!": 2,
  "@": 2,
  "#": 2,
  "$": 2,
  "%": 2,
  "^": 2,
  "&": 2,
  "*": 2,
  "(": 2,
  ")": 1,
  "_": 2,
  "-": 1,
  "+": 1,
  "=": 1,
  "{": 2,
  "[": 1,
  "}": 2,
  "]": 1,
  ":": 2,
  ";": 1,
  "'": 1,
  '"': 2,
  "<": 2,
  ",": 1,
  ">": 2,
  ".": 1,
  "?": 2,
  "/": 2,
  "|": 2,
  "§": 1,
  "ě": 1,
  "š": 1,
  "č": 1,
  "ř": 1,
  "ž": 1,
  "ý": 1,
  "á": 1,
  "í": 1,
  "é": 1,
  "ú": 1,
  "ů": 1,
  "ď": 3,
  "ť": 3,
  "ň": 3,
  "ó": 2,
  "Ě": 4,
  "Š": 4,
  "Č": 4,
  "Ř": 4,
  "Ž": 4,
  "Ý": 3,
  "Á": 3,
  "Í": 3,
  "É": 3,
  "Ú": 3,
  "Ů": 4,
  "Ď": 4,
  "Ť": 4,
  "Ň": 4,
  "Ó": 3
};

const PENALTY_COEFFICIENT = 10;

// TODO not standartized calculations, see: 
// https://cs.wikipedia.org/wiki/Psac%C3%AD_stroj#:~:text=Rychlost%20psan%C3%AD%20se%20uv%C3%A1d%C3%AD%20v,d%C4%9Bl%C3%AD%20dobou%20psan%C3%AD%20v%20minut%C3%A1ch.
// https://www.100utils.com/how-to-calculate-typing-speed-wpm-and-accuracy/

export const calcTypingSpeedInKeystrokes = (seconds: number, keyStrokeCount: number, mistakeCount: number) => {
  if(!seconds) return 0;
  return Math.round((keyStrokeCount - mistakeCount * PENALTY_COEFFICIENT) / seconds * 60);
};

export const calcTypingSpeedInWPM = (text: string, seconds: number, mistakeCount: number) => {
  if(!seconds) return 0;
  const wordCount = text.split(" ").length;
  return Math.round((wordCount - mistakeCount) / seconds * 60);
};

export const calcTypingPrecision = (keyStrokeCount: number, mistakeCount: number) => {
  const exactPercentage = 100 - mistakeCount * 100 / keyStrokeCount;
  
  const DECIMAL = 10;
  return Math.round(exactPercentage * DECIMAL) / DECIMAL;
};

function getBestKeyStrokeCount(text: string, symbolKeystrokes: Record<string, number>) {
  return text.split("")
    .reduce((count, symbol) => count + symbolKeystrokes[symbol as keyof typeof symbolKeystrokes], 0)
}
