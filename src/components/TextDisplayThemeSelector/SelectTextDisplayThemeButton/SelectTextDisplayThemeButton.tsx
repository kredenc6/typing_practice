import React from "react";
import { Button, ButtonProps, makeStyles } from "@material-ui/core";
import { TextDisplayTheme } from "../../../types/types";

interface Props {
  textDisplayThemePalette: TextDisplayTheme["palette"];
}

const useStyles = makeStyles(({ palette }) => ({
  paletteButton: {
    backgroundColor: ({ background }: TextDisplayTheme["palette"]) => background.main,
    border: "2px solid transparent",
    "&.Mui-disabled": {
      border: `2px solid ${palette.info.dark}`
    },
    "&:hover": {
      backgroundColor: palette.info.dark
    }
  },
  correct: {
    color: ({ symbols }: TextDisplayTheme["palette"]) => symbols.correct.color,
    backgroundColor: ({ symbols }: TextDisplayTheme["palette"]) => symbols.correct.bgcColor
  },
  corrected: {
    color: ({ symbols }: TextDisplayTheme["palette"]) => symbols.corrected.color,
    backgroundColor: ({ symbols }: TextDisplayTheme["palette"]) => symbols.corrected.bgcColor
  },
  mistyped: {
    color: ({ symbols }: TextDisplayTheme["palette"]) => symbols.mistyped.color,
    backgroundColor: ({ symbols }: TextDisplayTheme["palette"]) => symbols.mistyped.bgcColor
  },
  symbol: {
    marginRight: "1px",
    padding: "0 1px",
    borderRadius: "2px"
  }
}));

export default function SelectTextDisplayThemeButton({ textDisplayThemePalette, ...buttonProps}: Props & ButtonProps) {
  const classes = useStyles(textDisplayThemePalette);

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
