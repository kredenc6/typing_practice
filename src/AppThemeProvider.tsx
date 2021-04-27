import React, { FC } from "react";
import { ThemeProvider } from "./styles/themeContext";

const AppThemeProvider: FC = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
