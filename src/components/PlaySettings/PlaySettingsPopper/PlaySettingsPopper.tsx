import { useContext } from "react";
import { Popper, PopperProps } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { PlayPageThemeContext } from "../../../styles/themeContexts";
import { TextDisplayTheme } from "../../../types/themeTypes";

const useStyles = makeStyles({
  popper: {
    width: "23rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-1px",
    padding: "0.5rem",
    backgroundColor: (textDisplayTheme: TextDisplayTheme) => textDisplayTheme.background.secondary,
    borderTop: (textDisplayTheme: TextDisplayTheme) => `1px solid ${textDisplayTheme.background.secondary}`,
    borderRight: (textDisplayTheme: TextDisplayTheme) => `1px solid ${textDisplayTheme.text.secondary}`,
    borderBottom: (textDisplayTheme: TextDisplayTheme) => `1px solid ${textDisplayTheme.text.secondary}`,
    borderLeft: (textDisplayTheme: TextDisplayTheme) => `1px solid ${textDisplayTheme.text.secondary}`,
    zIndex: 3
  }
});

export default function PlaySettingPopper({ children, ...popperProps }: PopperProps) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);
  const classes = useStyles(textDisplayTheme);

  return (
    <Popper
      className={classes.popper}
      id="playSettingsPopper"
      placement="bottom-end"
      {...popperProps}
    >
      {children}
    </Popper>
  );
}
