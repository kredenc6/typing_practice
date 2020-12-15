import React from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import TextInput from "../TextInput/TextInput";
import { FormatSize, Palette, Refresh } from "@material-ui/icons";
import ButtonIconPopover from "../ButtonIconPopover/ButtonIconPopover";
import TextFormatPopover from "../TextFormatPopover/TextFormatPopover";
import TextDisplayThemeSelector from "../TextDisplayThemeSelector/TextDisplayThemeSelector";
import { FontData, RequireAtLeastOne, TextDisplayTheme } from "../../types/types";
import normalizeText from "../../textFunctions/normalizeText";


interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: RequireAtLeastOne<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setTextDisplayTheme: React.Dispatch<React.SetStateAction<TextDisplayTheme>>
  text: string;
  textDisplayTheme: TextDisplayTheme;
}

const useStyles = makeStyles(({ palette }) => ({
  settingsWrapper: {
    padding: "0.5rem 1rem",
    backgroundColor: ({ palette }: TextDisplayTheme) => palette.background.secondary,
    color: ({ palette }: TextDisplayTheme) => palette.text.secondary
  }
}));

export default function PlaySettings(
  { fontData, handleFontDataChange, setText, setTextDisplayTheme, text, textDisplayTheme }: Props
) {
  const classes = useStyles(textDisplayTheme);
  const handleTextChange = async (text: string) => {
    setText(await normalizeText(text));
  };

  const handleTextDisplayThemeChange = (fieldChanges: Partial<TextDisplayTheme>) => {
    setTextDisplayTheme(prev => ({ ...prev, ...fieldChanges }));
  };

  const adjustSymbolRightMargin = (marginRight: string) => {
    setTextDisplayTheme(prev => ({ ...prev, offset: { ...prev.offset, text: { ...prev.offset.text, marginRight } } }));
  };

  const { fontFamily, fontSize } = fontData;

  return(
    <div className={classes.settingsWrapper}>
      <p>Paste the text here:</p>
      <TextInput handleTextChange={handleTextChange} name="textInput" type="text" value={text} />
      <ButtonIconPopover
        IconComponent={FormatSize}
        PopoverContent={
          <TextFormatPopover
            adjustSymbolRightMargin={adjustSymbolRightMargin}
            fontTheme={{ fontFamily, fontSize }}
            handleFontDataChange={handleFontDataChange}
            textDisplayTheme={textDisplayTheme} />
        }
        textDisplayTheme={textDisplayTheme} />
      <ButtonIconPopover
        IconComponent={Palette}
        PopoverContent={
          <TextDisplayThemeSelector
            handleTextDisplayThemeChange={handleTextDisplayThemeChange}
            textDisplayTheme={textDisplayTheme} />
        }
        textDisplayTheme={textDisplayTheme} />
      <IconButton>
        <Refresh />
      </IconButton>
    </div>
  );
}
