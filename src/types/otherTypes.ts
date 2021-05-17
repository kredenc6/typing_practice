import { WordObject } from "./symbolTypes";

export interface AllowedMistype {
  count: 0 | 1 | 2;
  isAllowed: boolean;
}

export type GameStatus = "settingUp" | "start" | "playing" | "finished";

export type Results = {
  mistypedWords: WordObject[];
  typingSpeed: number;
  wpm: number;
  precision: number;
  time: string;
};

/**
 * USE ONLY WITH OBJECTS THAT ARE THE SAME ON COMPILE/RUN TIME !!!
 * https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
 * https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript
 */
export type Unsafe_Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]
