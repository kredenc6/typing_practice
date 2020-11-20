import { createContext } from "react";
import { createTheming } from "react-jss";
import { Theme } from "../types/types";

export const defaultTheme: Theme = {
  textDisplayFontStyle: {
    fontFamily: "Fira Code",
    fontSize: "20px"
  }
};

const defaultThemeContext = createContext(defaultTheme);
export const { withTheme, ThemeProvider, useTheme } = createTheming(defaultThemeContext);
