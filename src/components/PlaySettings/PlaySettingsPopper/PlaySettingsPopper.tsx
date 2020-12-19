import React from "react";
import { makeStyles, Popper, PopperProps } from "@material-ui/core";
import { TextDisplayTheme } from "../../../types/types";

interface Props extends PopperProps {
  textDisplayTheme: TextDisplayTheme
}

const useStyles = makeStyles({
  popper: {
    width: "23rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-1px",
    padding: "0.5rem",
    backgroundColor: ({ palette }: TextDisplayTheme) => palette.background.secondary,
    borderTop: ({ palette }: TextDisplayTheme) => `1px solid ${palette.background.secondary}`,
    borderRight: ({ palette }: TextDisplayTheme) => `1px solid ${palette.text.secondary}`,
    borderBottom: ({ palette }: TextDisplayTheme) => `1px solid ${palette.text.secondary}`,
    borderLeft: ({ palette }: TextDisplayTheme) => `1px solid ${palette.text.secondary}`
  }
});

export default function PlaySettingPopper({ children, textDisplayTheme, ...popperProps }: Props) {
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
