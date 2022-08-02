import { createTheme, PaletteMode, ThemeOptions } from "@mui/material";
import { Theme } from '@mui/material/styles';
import { LOCAL_STORAGE_KEYS } from "../constants/constants";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    background: {
      paper: "#222"
    }
  }
};

export const createAppTheme = (mode?: PaletteMode) => {
  const paletteMode = mode
    ? mode
    : localStorage.getItem(LOCAL_STORAGE_KEYS.THEME_TYPES);

  if(paletteMode === "dark") {
    return createTheme(darkThemeOptions);
  }

  return createTheme();
};
