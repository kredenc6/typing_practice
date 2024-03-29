import { type ReactNode, createContext, useContext, useState } from "react";
import { LOCAL_STORAGE_KEYS } from "../constants/constants";
import { type TextDisplayTheme } from "../types/themeTypes";
import { defaultTextDisplayTheme } from "./textDisplayTheme/textDisplayData";
import { addUserIdToStorageKey } from "../appHelpFunctions";
import parseStorageItem from "../helpFunctions/parseStorageItem";

interface ThemeContextType {
  state: TextDisplayTheme;
  update: (theme: TextDisplayTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const usePlayPageTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  userId: string | null;
}

export const PlayPageThemeProvider: React.FC<ThemeProviderProps> = ({ children, userId }) => {
  let startTheme: TextDisplayTheme;

  if(userId) {
    const localTextDisplayThemeKey = addUserIdToStorageKey(userId, LOCAL_STORAGE_KEYS.PLAY_PAGE_THEME);
    startTheme = parseStorageItem(localTextDisplayThemeKey) ?? defaultTextDisplayTheme;
  } else {
    startTheme = defaultTextDisplayTheme;
  }

  const [theme, setTheme] = useState<TextDisplayTheme>(startTheme);

  const update = (newTheme: TextDisplayTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ state: theme, update }}>
      {children}
    </ThemeContext.Provider>
  );
};
