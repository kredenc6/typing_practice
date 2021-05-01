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
  backgroundColor: string;
  color: string;
}

export interface Offset {
  display: {
    marginTop: string;
    marginRight: string;
    marginBottom: string;
    marginLeft: string;
    paddingTop: string;
    paddingRight: string;
    paddingBottom: string;
    paddingLeft: string;
  },
  symbol: {
    paddingLeft: string;
    paddingRight: string;
    marginRight: string;
  }
}
/**
 * keep any sizing in px
 */
export interface TextDisplayTheme {
  name: string;
  background: {
    main: string;
    secondary: string;
  },
  symbols: {
    active: FontThemeStyle;
    correct: FontThemeStyle;
    corrected: FontThemeStyle;
    pending: FontThemeStyle;
    mistyped: FontThemeStyle;
    invalid: FontThemeStyle;
  },
  offset: Offset;
}

export interface SymbolStyle extends FontThemeStyle {
  cursorColor: string;
  symbolOffset: Offset["symbol"];
}

export interface AnimateMistyped {
  symbol: string;
  symbolPosition: number;
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> 
  & {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
