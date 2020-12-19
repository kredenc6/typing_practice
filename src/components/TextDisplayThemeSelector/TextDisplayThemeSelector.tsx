import React from "react";
import { makeStyles } from "@material-ui/core";
import SelectTextDisplayThemeButton from "./SelectTextDisplayThemeButton/SelectTextDisplayThemeButton";
import * as availableTextDisplayPalettes from "../../styles/textDisplayPalettes";
import { TextDisplayTheme } from "../../types/types";

interface Props {
  handleTextDisplayThemeChange: (fieldChanges: Partial<TextDisplayTheme>) => void;
  textDisplayTheme: TextDisplayTheme
}

const useStyles = makeStyles({
  themeSelector: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    padding: "1rem",
    backgroungColor: ({ palette }: TextDisplayTheme) => palette.background.secondary
  }
})

export default function TextDisplayThemeSelector({ handleTextDisplayThemeChange, textDisplayTheme }: Props) {
  const classes = useStyles(textDisplayTheme);
  const handleClick = (palette: Pick<TextDisplayTheme, "palette">) => {
    handleTextDisplayThemeChange(palette);
  };

  const ThemeButtonComponents = Object.keys(availableTextDisplayPalettes).map(paletteName => (
    <SelectTextDisplayThemeButton
      disabled={paletteName === textDisplayTheme.palette.name}
      key={paletteName}
      onClick={() => handleClick(availableTextDisplayPalettes[paletteName as keyof typeof availableTextDisplayPalettes])}
      textDisplayThemePalette={availableTextDisplayPalettes[paletteName as keyof typeof availableTextDisplayPalettes].palette} />
  ));

  return (
    <div className={classes.themeSelector}>
      {ThemeButtonComponents}
    </div>
  );
}
