import { Button, type ButtonProps, type CSSObject, Typography } from "@mui/material";
import { useContext } from "react";
import { PlayPageThemeContext } from "../../../styles/themeContexts";
import { type TextDisplayTheme } from "../../../types/themeTypes";
import { type SymbolCorrectness } from "../../../types/symbolTypes";

const BUTTON_TEXT = "barevné téma";

interface Props extends ButtonProps {
  themeToSelect: Omit<TextDisplayTheme, "offset">;
}

export default function SelectTextDisplayThemeButton({
  themeToSelect, ...buttonProps
}: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);

  const ButtonLetterComponents = BUTTON_TEXT
    .split("")
    .map((letter, i) => {
      const createLetterStyle = (correctness: Exclude<SymbolCorrectness, "invalid" | "pending">): CSSObject => ({
        marginRight: "1px",
        padding: "0 1px",
        fontSize: "0.9rem",
        borderRadius: "2px",
        color: themeToSelect.symbols[correctness as keyof typeof themeToSelect.symbols].color,
        backgroundColor: themeToSelect.symbols[correctness as keyof typeof themeToSelect.symbols].backgroundColor
      });

      let letterStyle: CSSObject;
      if(i === 2)      letterStyle = createLetterStyle("corrected");
      else if(i === 9) letterStyle = createLetterStyle("mistyped");
      else             letterStyle = createLetterStyle("correct");
      
      return <Typography key={i} sx={letterStyle}>{letter}</Typography>;
  });

  return (
    <Button
      sx={({ palette }) => ({
        background: themeToSelect.background.main,
        border: `1px solid ${textDisplayTheme.text.secondary}`,
        "&.Mui-disabled": {
          border: `2px solid ${palette.info.dark}`
        },
        "&:hover": {
          backgroundColor: palette.info.dark,
          border: `1px solid ${palette.info.dark}`
        }})
      }
      {...buttonProps}>
      {ButtonLetterComponents}
    </Button>
  );
}
