import { FontFamilies, FontSize, FontData, TextDisplayTheme } from "../../types/types";

export const defaultTextDisplayFontData: FontData = {
  fontFamily: "Fira Code",
  fontSize: "30px",
  fontLocation: "google",
  symbolWidths: {}
};

export const defaultTextDisplayTheme: TextDisplayTheme = {
  palette: {
    text: {
      active: {
        bgcColor: "inherit",
        color: "#757575"
      },
      correct: {
        bgcColor: "#e7fbd3",
        color: "#0e630e"
      },
      corrected: {
        bgcColor: "#ffe9b2",
        color: "green"
      },
      default: {
        bgcColor: "inherit",
        color: "#757575"
      },
      mistyped: {
        bgcColor: "pink",
        color: "darkred"
      }
    }
  },
  offset: {
    display: {
      margin: "20px auto",
      padding: "10px 20px"
    },
    text: {
      padding: "0 1px",
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
