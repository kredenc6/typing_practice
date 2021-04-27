import React from "react";
import { Button, ButtonProps, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(({ palette, textDisplayTheme }) => ({
  paletteButton: {
    backgroundColor: textDisplayTheme.background.main,
    border: "2px solid transparent",
    "&.Mui-disabled": {
      border: `2px solid ${palette.info.dark}`
    },
    "&:hover": {
      backgroundColor: palette.info.dark
    }
  },
  correct: {
    color: textDisplayTheme.symbols.correct.color,
    backgroundColor: textDisplayTheme.symbols.correct.bgcColor
  },
  corrected: {
    color: textDisplayTheme.symbols.corrected.color,
    backgroundColor: textDisplayTheme.symbols.corrected.bgcColor
  },
  mistyped: {
    color: textDisplayTheme.symbols.mistyped.color,
    backgroundColor: textDisplayTheme.symbols.mistyped.bgcColor
  },
  symbol: {
    marginRight: "1px",
    padding: "0 1px",
    borderRadius: "2px"
  }
}));

export default function SelectTextDisplayThemeButton(buttonProps: ButtonProps) {
  const classes = useStyles();

  return (
    <Button className={classes.paletteButton} {...buttonProps}>
      <span className={`${classes.symbol} ${classes.correct}`}>S</span>
      <span className={`${classes.symbol} ${classes.correct}`}>e</span>
      <span className={`${classes.symbol} ${classes.correct}`}>l</span>
      <span className={`${classes.symbol} ${classes.correct}`}>e</span>
      <span className={`${classes.symbol} ${classes.correct}`}>c</span>
      <span className={`${classes.symbol} ${classes.correct}`}>t</span>
      <span className={`${classes.symbol} ${classes.correct}`}></span>
      <span className={`${classes.symbol} ${classes.corrected}`}>T</span>
      <span className={`${classes.symbol} ${classes.correct}`}>h</span>
      <span className={`${classes.symbol} ${classes.correct}`}>e</span>
      <span className={`${classes.symbol} ${classes.mistyped}`}>m</span>
      <span className={`${classes.symbol} ${classes.correct}`}>e</span>
    </Button>
  );
}
