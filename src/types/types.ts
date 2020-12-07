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

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> 
  & {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
