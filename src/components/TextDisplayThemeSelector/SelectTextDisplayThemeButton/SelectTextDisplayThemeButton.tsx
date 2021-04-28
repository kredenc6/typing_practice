import React from "react";
import { Button, ButtonProps, makeStyles } from "@material-ui/core";
import { NewTextDisplayTheme } from "../../../types/types";

interface Props extends ButtonProps {
  themeToSelect: Omit<NewTextDisplayTheme, "offset">;
}

interface UseStylesProps {
  themeToSelect: Props["themeToSelect"];
}

const useStyles = makeStyles(({ palette }) => ({
  paletteButton: {
    backgroundColor: ({ themeToSelect }: UseStylesProps) => themeToSelect.background.main,
    border: "2px solid transparent",
    "&.Mui-disabled": {
      border: `2px solid ${palette.info.dark}`
    },
    "&:hover": {
      backgroundColor: palette.info.dark
    }
  },
  correct: {
    color: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.correct.color,
    backgroundColor: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.correct.bgcColor
  },
  corrected: {
    color: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.corrected.color,
    backgroundColor: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.corrected.bgcColor
  },
  mistyped: {
    color: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.mistyped.color,
    backgroundColor: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.mistyped.bgcColor
  },
  symbol: {
    marginRight: "1px",
    padding: "0 1px",
    borderRadius: "2px"
  }
}));

export default function SelectTextDisplayThemeButton(
  { themeToSelect: availableTextDisplayTheme, ...buttonProps }: Props)
{
  const classes = useStyles({ themeToSelect: availableTextDisplayTheme });

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
