import { Bytes } from "firebase/firestore";
import Timer from "../accessories/Timer";
import { SymbolCorrectness, WordObject, WordType } from "./symbolTypes";

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

export type CompressedText = {
  compressedText: Bytes;
  compressedTextLength: number;
}

export type UserDB = {
  id: string;
  name: string | null;
  picture: string | null;
  isAdmin: boolean;
  createdAt: number;
  compressedMistypedWords?: CompressedText;
  compressedLatestResults?: CompressedText;
}

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

export type ShortenedResultObj = {
  mistypedWords: MistypedWord[];
  typingSpeed: number;
  wpm: number;
  precision: number;
  time: string;
  textLength: number;
  timestamp: number;
}
