import React from "react";
import SelectTextDisplayThemeButton from "../SelectTextDisplayThemeButton/SelectTextDisplayThemeButton";
import * as availableTextDisplayThemes from "../../../styles/textDisplayPalettes";
import { TextDisplayTheme } from "../../../types/types";

interface Props {
  handleTextDisplayThemeChange: (fieldChanges: Partial<TextDisplayTheme>) => void;
}

export default function TextDisplayThemeSelector({ handleTextDisplayThemeChange }: Props) {
  const handleClick = (palette: Pick<TextDisplayTheme, "palette">) => {
    handleTextDisplayThemeChange(palette);
  };



  const ThemeButtonComponents = Object.keys(availableTextDisplayThemes).map(themeName => (
    <SelectTextDisplayThemeButton
      handleClick={() => handleClick(availableTextDisplayThemes[themeName as keyof typeof availableTextDisplayThemes])}
      key={themeName}
      themeName={themeName} />
  ));

  return (
    <div>
      {ThemeButtonComponents}
    </div>
  );
}
