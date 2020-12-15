// font styles for displaying text
export type FontSize = "20px" | "30px" | "40px";
export type FontFamily = "Bitter" | "Comfortaa" | "Fira Code" | "Inconsolata" | "monospace" | "Roboto Mono" | "Trispace";
type FontLocation = "google" | "local";

export interface FontStyle {
  fontFamily: FontFamily;
  fontSize: FontSize;
  fontLocation: FontLocation;
}

export interface FontData extends FontStyle {
  symbolWidths: {
    [keyboardChar: string]: number;
  }
}

export type FontFamilies = {
  name: FontFamily;
  location: FontLocation;
}[]

export interface FontThemeStyle {
  bgcColor: string;
  color: string;
}

interface Offset {
  display: {
    margin: string;
    padding: string;
  },
  text: {
    padding: string;
    marginRight: string;
  }
}

export interface TextDisplayTheme {
  palette: {
    background: {
      main: string;
      secondary: string;
    },
    name: string;
    symbols: {
      active: FontThemeStyle;
      correct: FontThemeStyle;
      corrected: FontThemeStyle;
      default: FontThemeStyle;
      mistyped: FontThemeStyle;
    },
    text: {
      main: string;
      secondary: string;
    }
  },
  offset: Offset;
}

export interface SymbolStyle extends FontThemeStyle {
  cursorColor: string;
  symbolOffset: Offset["text"];
}

export type RelativePosition = "pending" | "active" | "processed";

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> 
  & {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
