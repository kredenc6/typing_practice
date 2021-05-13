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
