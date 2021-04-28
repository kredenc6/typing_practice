import { createMuiTheme, responsiveFontSizes, ThemeOptions } from "@material-ui/core";
import { defaultTextDisplayTheme } from "./textDisplayTheme/textDisplayData";

const settings = {
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  textDisplayTheme: defaultTextDisplayTheme
};


let appTheme = createMuiTheme(settings);
appTheme = responsiveFontSizes(appTheme);

export default appTheme;

export const createUpdatedAppTheme = (update: ThemeOptions) => {
  const settings = {
    props: {
      MuiButtonBase: {
        disableRipple: true
      }
    },
    textDisplayTheme: defaultTextDisplayTheme,
    ...update
  };

  let updatedAppTheme = createMuiTheme(settings);
  updatedAppTheme = responsiveFontSizes(updatedAppTheme);

  return updatedAppTheme;
};
