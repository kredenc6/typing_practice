import Timer from "../accessories/Timer";
import { WordObject } from "./symbolTypes";

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

export type MistypedWords = [string, number[]][];

export type MistypedWordsLog = {
  words: MistypedWords;
  sorting: {

    // TODO alphabetical is sorted number array from 0 to arr.length - 1, it should be possible to delete it
    // and save the extra space
    alphabetical: number[];
    byTime: number[];
    byMistypeCount: number[];
  }
}

export type SortBy = "alphabetical:desc" | "alphabetical:asc" | "byMistypeCount:desc" | "byMistypeCount:asc" | "byTime:desc" | "byTime:asc";

export type User = {
  name: string | null;
  picture: string | null;
  isAdmin: boolean;
  createdAt: number;
}