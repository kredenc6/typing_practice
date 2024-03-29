import { Box } from "@mui/material";
import SelectTextDisplayThemeButton from "./SelectTextDisplayThemeButton/SelectTextDisplayThemeButton";
import * as availableTextDisplayPalettes from "../../styles/textDisplayPaletes";
import { type TextDisplayTheme } from "../../types/themeTypes";

interface Props {
  handleTextDisplayThemeChange: (fieldChanges: Omit<TextDisplayTheme, "offset">) => void;
  textDisplayTheme: TextDisplayTheme
}

// TODO switching the theme makes the buttons move by 1px - due to border height change
export default function TextDisplayThemeSelector({ handleTextDisplayThemeChange, textDisplayTheme }: Props) {
  const handleClick = (palette: Omit<TextDisplayTheme, "offset">) => {
    handleTextDisplayThemeChange(palette);
  };

  const ThemeButtonComponents = Object.keys(availableTextDisplayPalettes).map(paletteName => (
    <SelectTextDisplayThemeButton
      disabled={paletteName === textDisplayTheme.name}
      key={paletteName}
      onClick={() => handleClick(availableTextDisplayPalettes[paletteName as keyof typeof availableTextDisplayPalettes])}
      themeToSelect={availableTextDisplayPalettes[paletteName as keyof typeof availableTextDisplayPalettes]} />
  ));

  return (
    <Box
      sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1.5rem",
      padding: "1rem",
      backgroungColor: textDisplayTheme.background.secondary
      }}
    >
      {ThemeButtonComponents}
    </Box>
  );
}
