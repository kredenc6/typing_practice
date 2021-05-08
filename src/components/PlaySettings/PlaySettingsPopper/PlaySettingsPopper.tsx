import React from "react";
import { makeStyles, Popper, PopperProps } from "@material-ui/core";

const useStyles = makeStyles(({ palette, textDisplayTheme }) => ({
  popper: {
    width: "23rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-1px",
    padding: "0.5rem",
    backgroundColor: textDisplayTheme.background.secondary,
    borderTop: `1px solid ${textDisplayTheme.background.secondary}`,
    borderRight: `1px solid ${textDisplayTheme.text.secondary}`,
    borderBottom: `1px solid ${textDisplayTheme.text.secondary}`,
    borderLeft: `1px solid ${textDisplayTheme.text.secondary}`
  }
}));

export default function PlaySettingPopper({ children, ...popperProps }: PopperProps) {
  const classes = useStyles();
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
