import { defaultPalette } from "../textDisplayThemes";
import { FontFamilies, FontSize, FontData, NewTextDisplayTheme } from "../../types/types";

export const defaultTextDisplayFontData: FontData = {
  fontFamily: "Fira Code",
  fontSize: "30px",
  fontLocation: "google",
  symbolWidths: {}
};

export const defaultTextDisplayTheme: NewTextDisplayTheme = {
  ...defaultPalette,
  offset: {
    display: {
      margin: "1rem auto",
      padding: "0.5rem 1.5rem"
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
