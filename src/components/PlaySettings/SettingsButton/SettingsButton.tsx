import React from "react";
import { Button, makeStyles, ButtonProps } from "@material-ui/core";
import classnames from "classnames";

const useStyles = makeStyles(({ palette }) => ({
  settingsButton: {
    height: "100%",
    color: "inherit",
    "& .MuiButton-label": {
      borderBottom: "2px solid transparent",
    },
    "&.Mui-disabled": {
      color: palette.info.main,
      "& .MuiButton-label": {
        borderBottomColor: palette.info.main,
      }
    },
    "&:hover": {
      color: palette.info.main,
      "& .MuiButton-label": {
        borderBottomColor: palette.info.main
      }
    }
  }
}));

export default function SettingsButton({ children, className, ...buttonProps }: ButtonProps) {
  const classes = useStyles();
  return (
    <Button
      className={classnames(classes.settingsButton, className)}
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
