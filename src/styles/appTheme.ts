import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material";
import { LOCAL_STORAGE_KEYS } from "../constants/constants";

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
