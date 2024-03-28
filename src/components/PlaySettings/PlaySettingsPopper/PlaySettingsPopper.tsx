import { useContext } from "react";
import { Popper, type PopperProps } from "@mui/material";
import { PlayPageThemeContext } from "../../../styles/themeContexts";

export default function PlaySettingPopper({ children, ...popperProps }: PopperProps) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);

  return (
    <Popper
      sx={{
        width: "23rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "-1px !important", // important overrides the placement prop
        marginRight: "2rem !important",
        padding: "0.5rem",
        backgroundColor: textDisplayTheme.background.secondary,
        borderTop: `1px solid ${textDisplayTheme.background.secondary}`,
        borderRight: `1px solid ${textDisplayTheme.text.secondary}`,
        borderBottom: `1px solid ${textDisplayTheme.text.secondary}`,
        borderLeft: `1px solid ${textDisplayTheme.text.secondary}`,
        zIndex: 3
      }}
      id="playSettingsPopper"
      placement="bottom-end"
      {...popperProps}
    >
      {children}
    </Popper>
  );
}
