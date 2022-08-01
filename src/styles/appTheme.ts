import { createTheme } from "@mui/material";
import { Theme } from '@mui/material/styles';
import { LOCAL_STORAGE_KEYS } from "../constants/constants";
import { ThemeType } from "../types/themeTypes";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

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
  
  let themeOptions = themeSettings;

  if(themeType === "dark") {
    themeOptions = { ...themeOptions, ...darkThemeOptions }
  }

  // return createTheme(themeOptions); // BUG Mui v.5
  return createTheme();
};
