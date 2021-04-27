// import { Theme as OriginalMuiTheme, ThemeOptions } from "@material-ui/core";
import { NewTextDisplayTheme } from "./types/types";

declare module "@material-ui/core" {
  export interface Theme {
    textDisplayTheme: NewTextDisplayTheme
  }
}


// TODO later on this could have separate updates? - see ThemeOptions in createMuiTheme.d.ts
declare module "@material-ui/core" {
  export interface ThemeOptions {
    textDisplayTheme: NewTextDisplayTheme
  }
}
