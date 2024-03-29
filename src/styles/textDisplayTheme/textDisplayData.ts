import { defaultPalette } from "../textDisplayPaletes";
import { type FontFamilies, type FontSize, type FontStyle, type TextDisplayTheme } from "../../types/themeTypes";
import { DEFAULT_FONT_SIZE } from "../../constants/constants";

export const defaultTextDisplayFontStyle: FontStyle = {
  fontFamily: "Fira Code",
  fontSize: DEFAULT_FONT_SIZE,
  fontLocation: "google"
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
      paddingRight: DEFAULT_FONT_SIZE,
      paddingBottom: "8px",
      paddingLeft: DEFAULT_FONT_SIZE
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
