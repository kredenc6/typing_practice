import { FontData } from "./themeTypes";

export type WordType = "word" | "whitespace" | "other";
export type RelativeSymbolPosition = "pending" | "active" | "processed";
export type SymbolCorrectness = "pending" | "correct" | "mistyped" | "corrected";

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

