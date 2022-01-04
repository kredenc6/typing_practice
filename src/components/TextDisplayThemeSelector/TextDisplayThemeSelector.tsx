import { Box, makeStyles } from "@material-ui/core";
import SelectTextDisplayThemeButton from "./SelectTextDisplayThemeButton/SelectTextDisplayThemeButton";
import * as availableTextDisplayPalettes from "../../styles/textDisplayPaletes";
import { TextDisplayTheme } from "../../types/themeTypes";

interface Props {
  handleTextDisplayThemeChange: (fieldChanges: Omit<TextDisplayTheme, "offset">) => void;
  textDisplayTheme: TextDisplayTheme
}

const useStyles = makeStyles({
  themeSelector: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    padding: "1rem",
    backgroungColor: ( textDisplayTheme: TextDisplayTheme) => textDisplayTheme.background.secondary
  }
});

export default function TextDisplayThemeSelector({ handleTextDisplayThemeChange, textDisplayTheme }: Props) {
  const classes = useStyles(textDisplayTheme);
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
    <Box className={classes.themeSelector}>
      {ThemeButtonComponents}
    </Box>
  );
}
