import Timer from "../accessories/Timer";
import { WordObject } from "./symbolTypes";
import { TokenResponse } from "@react-oauth/google";

export interface AllowedMistype {
  count: 0 | 1 | 2;
  isAllowed: boolean;
}

export type GameStatus = "settingUp" | "ready" | "playing" | "finished" | "selfType";

export type Results = {
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

// export type MistypedWordsLogWithMap = {
//   words: Map<string, number[]>; // <word, mistypeTimestamps[]>
//   sorting: {
//     alphabetical: number[];
//     byTime: number[];
//     byMistypeCount: number[];
//   }
// }

// TODO it might be good to get back to this approach to save file size
// TODO minimaze prop names for file size
// export type MistypedWordsLog = {
//   words: [string, number[]][]; // [word, mistypeTimestamps[]][]
//   sorting: {
//     alphabetical: number[];
//     byTime: number[];
//     byMistypeCount: number[];
//   }
// }

export type MistypedWordsLogV2 = {
  word: string;
  timestamps: number[];
  sorting: {
    alphabetical: number;
    byTime: number;
    byMistypeCount: number;
  }
}[]

export type SortBy = "alphabetical:desc" | "alphabetical:asc" | "byMistypeCount:desc" | "byMistypeCount:asc" | "byTime:desc" | "byTime:asc";

export type User = {
  id: string;
  name: string;
  picture: string;
};