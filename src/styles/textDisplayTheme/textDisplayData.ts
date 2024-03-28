import { defaultPalette } from "../textDisplayPaletes";
import { type FontFamilies, type FontSize, type FontData, type TextDisplayTheme } from "../../types/themeTypes";

export const defaultTextDisplayFontData: FontData = {
  fontFamily: "Fira Code",
  fontSize: "30px",
  fontLocation: "google",
  symbolWidths: {}
};

export const defaultTextDisplayTheme: TextDisplayTheme = {
  ...defaultPalette,
  offset: {
    display: {
      marginTop: "16px",
      marginRight: "auto",
      marginBottom: "16px",
      marginLeft: "auto",
      paddingTop: "8px",
      paddingRight: "24px",
      paddingBottom: "8px",
      paddingLeft: "24px"
    },
    symbol: {
      paddingLeft: "1px",
      paddingRight: "1px",
      marginRight: "1px"
    }
  }
};

export const fontFamilies: FontFamilies = [
  {
    name: "Bitter",
    location: "google"
  },
  {
    name: "Comfortaa",
    location: "google"
  },
  {
    name: "Fira Code",
    location: "google"
  },
  {
    name: "Inconsolata",
    location: "google"
  },
  {
    name: "monospace",
    location: "local"
  },
  {
    name: "Roboto Mono",
    location: "google"
  },
  {
    name: "Trispace",
    location: "google"
  }
];

export const fontSizes: FontSize[] = ["20px", "30px", "40px"];
