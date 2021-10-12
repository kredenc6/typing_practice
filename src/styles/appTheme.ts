import { createTheme, responsiveFontSizes, ThemeOptions } from "@material-ui/core";
import { TextDisplayTheme } from "../types/themeTypes";
import { defaultTextDisplayTheme } from "./textDisplayTheme/textDisplayData";

const localTextDisplayTheme = localStorage.getItem("typingPracticeTextDisplayTheme");
const determinedTextDisplayTheme =
  (localTextDisplayTheme && JSON.parse(localTextDisplayTheme) as TextDisplayTheme) ||
  defaultTextDisplayTheme;

const settings = {
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  textDisplayTheme: determinedTextDisplayTheme,
};

let appTheme = createTheme(settings);
appTheme = responsiveFontSizes(appTheme);

export default appTheme;

export const createUpdatedAppTheme = (update: ThemeOptions) => {
  const updateSettings = {
    ...settings,
    ...update
  };

  let updatedAppTheme = createTheme(updateSettings);
  updatedAppTheme = responsiveFontSizes(updatedAppTheme);

  return updatedAppTheme;
};
