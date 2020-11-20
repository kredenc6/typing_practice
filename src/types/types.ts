// font styles for displaying text
type FontSize = "20px" | "30px" | "40px";
type FontFamily = "Bitter" | "Comfortaa" | "Fira Code" | "Inconsolata" | "monospace" | "Roboto Mono" | "Trispace";

export interface FontStyle {
  fontFamily: FontFamily;
  fontSize: FontSize;
  location: "google" | "local";
}

export interface FontSymbolData extends FontStyle {
  symbolWidths: {
    [propName: string]: number;
  }
}

// theme
export interface Theme {
  textDisplayFontStyle: FontStyle;
}