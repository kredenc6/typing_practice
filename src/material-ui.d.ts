// import { Theme as OriginalMuiTheme, ThemeOptions } from "@material-ui/core";
import { TextDisplayTheme } from "./types/themeTypes";

declare module "@material-ui/core" {
  export interface Theme {
    textDisplayTheme: TextDisplayTheme
  }
}


// TODO later on textDisplayTheme could have separate updates? - see ThemeOptions in createMuiTheme.d.ts
declare module "@material-ui/core" {
  export interface ThemeOptions {
    textDisplayTheme?: TextDisplayTheme
  }
}
