// import { Theme as OriginalMuiTheme, ThemeOptions, Duration } from "@mui/material";
import React from "react";
import { ThemeType } from "./types/themeTypes";

declare module "@mui/material" {
  export interface Theme {
    updateTheme: (themeType: ThemeType) => React.Dispatch<React.SetStateAction<Theme>>;
  }
}

declare module "@mui/material" {
  export interface ThemeOptions {
    updateTheme?: (themeType: ThemeType) => React.Dispatch<React.SetStateAction<Theme>>;
  }
}
