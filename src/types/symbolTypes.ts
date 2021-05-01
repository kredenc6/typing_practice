import { FontData } from "./themeTypes";
import { defaultPalette } from "../styles/textDisplayPaletes";

export type WordType = "word" | "whitespace" | "other";
export type RelativeSymbolPosition = "pending" | "active" | "processed";
type SymbolCorrectnessTypes = "pending" | "correct" | "mistyped" | "corrected" | "invalid";
export type SymbolCorrectness = Extract<keyof typeof defaultPalette["symbols"], SymbolCorrectnessTypes>;

export type SymbolObject = {
  symbol: string;
  symbolPosition: number;
  correctness: SymbolCorrectness;
};

export type WordObject = {
  string: string;
  symbols: SymbolObject[];
  type: WordType;
  wordPosition: number;
  typedSpeed: number;
  wasCorrect: boolean;
}

export type Row = {
  highestSymbolPosition: number;
  symbolCount: number;
  words: WordObject[];
};

export type SymbolWidths = {
  widths: FontData["symbolWidths"];
  marginX: number;
  paddingX: number;
};
