import React from "react";
import { makeStyles, Popper, PopperProps } from "@material-ui/core";
import { TextDisplayTheme } from "../../../types/types";

interface Props extends PopperProps {
  textDisplayTheme: TextDisplayTheme
}

const useStyles = makeStyles({
  popper: {
    backgroundColor: ({ palette }: TextDisplayTheme) => palette.background.secondary,
    border: "1px solid #555"
  }
});

export default function PlaySettingPopper({ children, textDisplayTheme, ...popperProps }: Props) {
  const classes = useStyles(textDisplayTheme);
  return (
    <Popper className={classes.popper} id="playSettingsPopper" {...popperProps}>
      {children}
    </Popper>
  );
}
