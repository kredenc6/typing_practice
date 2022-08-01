import { Button, ButtonProps } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContext } from "react";
import { PlayPageThemeContext } from "../../../styles/themeContexts";
import { TextDisplayTheme } from "../../../types/themeTypes";

const BUTTON_TEXT = "barevné téma";

interface Props extends ButtonProps {
  themeToSelect: Omit<TextDisplayTheme, "offset">;
}

interface UseStylesProps {
  themeToSelect: Props["themeToSelect"];
  textDisplayTheme: TextDisplayTheme;
}

const useStyles = makeStyles(({ palette }) => ({
  paletteButton: {
    backgroundColor: ({ themeToSelect }: UseStylesProps) => themeToSelect.background.main,
    border: ({ textDisplayTheme }: UseStylesProps) => `1px solid ${textDisplayTheme.text.secondary}`,
    "&.Mui-disabled": {
      border: `2px solid ${palette.info.dark}`
    },
    "&:hover": {
      backgroundColor: palette.info.dark,
      border: `1px solid ${palette.info.dark}`
    }
  },
  correct: {
    color: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.correct.color,
    backgroundColor: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.correct.backgroundColor
  },
  corrected: {
    color: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.corrected.color,
    backgroundColor: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.corrected.backgroundColor
  },
  mistyped: {
    color: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.mistyped.color,
    backgroundColor: ({ themeToSelect }: UseStylesProps) => themeToSelect.symbols.mistyped.backgroundColor
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
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);
  const classes = useStyles({ themeToSelect: availableTextDisplayTheme, textDisplayTheme });

  const ButtonSpanComponents = BUTTON_TEXT
    .split("")
    .map((letter, i) => {
      let classNames = `${classes.symbol} `;
      if(i === 2)      classNames += classes.corrected;
      else if(i === 9) classNames += classes.mistyped;
      else             classNames += classes.correct;
      
      return <span key={i} className={classNames}>{letter}</span>;
  });

  return (
    <Button className={classes.paletteButton} {...buttonProps}>
      {ButtonSpanComponents}
    </Button>
  );
}
