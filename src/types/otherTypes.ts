import Timer from "../accessories/Timer";
import { type SymbolCorrectness, type WordObject, type WordType } from "./symbolTypes";

export interface AllowedMistype {
  count: 0 | 1 | 2;
  isAllowed: boolean;
}

export type GameStatus = "settingUp" | "ready" | "playing" | "finished" | "selfType";

export type ResultObj = {
  mistypedWords: WordObject[];
  typingSpeed: number;
  wpm: number;
  precision: number;
  time: string;
  textLength: number;
  timestamp: number;
};

/**
 * USE ONLY WITH OBJECTS THAT ARE THE SAME ON COMPILE/RUN TIME !!!
 * https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
 * https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript
 */
export type Unsafe_Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]


export type WordTimeObj = {
  timer: Timer;
  wordPosition: number;
}

export type MistypedWords = [string, number[]][];

export type MistypedWordsLog = {
  words: MistypedWords;
  sorting: {
    byTime: number[];
    byMistypeCount: number[];
  }
}

export type MinifiedMistypedWordsLog = {
  w: [string, number[]][];
  t: number[];
  s: {
    t: number[];
    c: number[];
  }
}

export type SortingDirection = "asc" | "desc";
export type SortingType = "alphabetical" | "byMistypeCount" | "byTime";
export type SortBy = `${SortingType}:${SortingDirection}`;

export type User = {
  id: string;
  name: string | null;
  picture: string | null;
  isAdmin: boolean;
  createdAt: number;
}

export type LatestResult = {
  mistypedWords: MistypedWord[];
  typingSpeed: number;
  wpm: number;
  precision: number;
  time: string;
  textLength: number;
  timestamp: number;
}

//// if I one day decide to put it into DB
// type UserTheme = {
//   t: "l" | "d"; // app theme (light | dark)
//   p: {  // play page
//     f: string; // font
//     s: string; // size
//     t: string; // play page theme
//     m: {  // mistake
//       b: boolean; // block
//       n: number; // number
//     }
//   }
// }

/**
 * i = id, n = name, p = picture (url), a = isAdmin, c = createdAt, 
 * m = mistypedWords, r = latestResults
 */
export type UserDB = {
  i: string;
  n: string | null;
  p: string | null;
  a: boolean;
  c: number;
  m?: string;
  r?: string;
}
// /**
//  * i = id, n = name, p = picture (url), a = isAdmin, c = createdAt, t = theme
//  * m = mistypedWords, r = latestResults
//  */
// export type UserDB = {
//   i: string;
//   n: string | null;
//   p: string | null;
//   a: boolean;
//   c: number;
//   t: Theming;
//   m?: string;
//   r?: string;
// }

/**
 * key is the index on which the mistype happened
 */
export type Mistypes = {
  [key: string]: SymbolCorrectness & ("corrected" | "mistyped");
}

export type MistypedWord = {
  string: string;
  type: WordType;
  typedSpeed: number;
  mistypes: Mistypes[];
}
