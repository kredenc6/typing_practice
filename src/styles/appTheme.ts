import { createTheme } from "@material-ui/core";
import { LOCAL_STORAGE_KEYS } from "../constants/constants";
import { ThemeType } from "../types/themeTypes";

const themeSettings = {
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  }
};

const darkThemeOptions = {
  palette: {
    type: "dark",
    background: {
      paper: "#343434"
    }
  }
};

export const createAppTheme = (type?: ThemeType) => {
  const themeType = type
    ? type
    : localStorage.getItem(LOCAL_STORAGE_KEYS.THEME_TYPES);
  

  console.log(`theme type: ${themeType}`)
  let themeOptions = themeSettings;

  if(themeType === "dark") {
    themeOptions = { ...themeOptions, ...darkThemeOptions }
  }

  return createTheme(themeOptions);
};
