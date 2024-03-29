import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material";
import { LOCAL_STORAGE_KEYS } from "../constants/constants";
import { addUserIdToStorageKey } from "../appHelpFunctions";

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    background: {
      paper: "#222"
    }
  }
};

export const createAppTheme = (userId: string | null, mode?: PaletteMode) => {
  // When the user in not logged in create a default theme.
  if(!userId) {
    return createTheme();
  }

  const key = addUserIdToStorageKey(userId, LOCAL_STORAGE_KEYS.THEME_TYPES);
  
  // Override with mode, otherwise return user selected theme.
  const paletteMode = mode
    ? mode
    : localStorage.getItem(key);

  // Apply dark mode.
  if(paletteMode === "dark") {
    return createTheme(darkThemeOptions);
  }

  // Apply light (default) mode.
  return createTheme();
};
