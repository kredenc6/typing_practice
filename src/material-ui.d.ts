// import { Theme as OriginalMuiTheme, ThemeOptions, Duration } from "@material-ui/core";
import React from "react";
import { ThemeType } from "./types/themeTypes";

declare module "@material-ui/core" {
  export interface Theme {
    updateTheme: (themeType: ThemeType) => React.Dispatch<React.SetStateAction<Theme>>;
  }
}

declare module "@material-ui/core" {
  export interface ThemeOptions {
    updateTheme?: (themeType: ThemeType) => React.Dispatch<React.SetStateAction<Theme>>;
  }
}
