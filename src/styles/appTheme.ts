import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";

const settings = {
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  }
};

let appTheme = createMuiTheme(settings);
appTheme = responsiveFontSizes(appTheme);

export default appTheme;
