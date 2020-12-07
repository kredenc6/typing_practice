import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
// import { FontStyle } from "../types/types";


// const textDisplayFontStyle: FontStyle = {
//   fontFamily: "Fira Code",
//   fontSize: "30px",
//   fontLocation: "google"
// };

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
