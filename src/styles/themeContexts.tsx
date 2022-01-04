import { LOCAL_STORAGE_KEYS } from "../constants/constants";
import createCtx from "../helpFunctions/createCtx";
import { TextDisplayTheme } from "../types/themeTypes";
import { defaultTextDisplayTheme } from "./textDisplayTheme/textDisplayData";

const localTextDisplayTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.TEXT_DISPLAY_THEME);
const determinedTextDisplayTheme =
  (localTextDisplayTheme && JSON.parse(localTextDisplayTheme) as TextDisplayTheme) ||
  defaultTextDisplayTheme;

export const [PlayPageThemeContext, PlayPageThemeProvider] = createCtx(determinedTextDisplayTheme);
