import React, { useLayoutEffect, useState } from "react";
import { Box, ClickAwayListener, IconButton, makeStyles } from "@material-ui/core";
import TextInput from "../TextInput/TextInput";
import { FormatSize, Palette, Refresh } from "@material-ui/icons";
import TextFormatPopper from "../TextFormatPoppper/TextFormatPopper";
import TextDisplayThemeSelector from "../TextDisplayThemeSelector/TextDisplayThemeSelector";
import { FontData, RequireAtLeastOne, TextDisplayTheme } from "../../types/types";
import normalizeText from "../../textFunctions/normalizeText";

import PlaySettingsPopper from "./PlaySettingsPopper/PlaySettingsPopper";

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
  },
  iconButton: {
    color: ({ palette }: TextDisplayTheme) => palette.text.secondary
  }
}));

export default function PlaySettings({
  fontData,
  handleFontDataChange,
  setText,
  setTextDisplayTheme,
  text,
  textDisplayTheme
}: Props) {
  const classes = useStyles(textDisplayTheme);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popperOpenedBy, setPopperOpenedBy] = useState("");
  
  const handleTextChange = async (text: string) => {
    setText(await normalizeText(text));
  };
  const handleTextDisplayThemeChange = (fieldChanges: Partial<TextDisplayTheme>) => {
    setTextDisplayTheme(prev => ({ ...prev, ...fieldChanges }));
  };
  const adjustSymbolRightMargin = (marginRight: string) => {
    setTextDisplayTheme(prev => ({ ...prev, offset: { ...prev.offset, text: { ...prev.offset.text, marginRight } } }));
  };
  const handleClick = (buttonId: string) => {
    const openedBy = buttonId !== popperOpenedBy ? buttonId : "";
    setPopperOpenedBy(openedBy);
  };
  const handleClickAway = () => {
    setPopperOpenedBy("");
  };

  const { fontFamily, fontSize } = fontData;
  const isPopperOpen = Boolean(popperOpenedBy);
  const popperContent = isPopperOpen && popperOpenedBy === "formatFontBtt" ?
    <TextFormatPopper
      adjustSymbolRightMargin={adjustSymbolRightMargin}
      fontTheme={{ fontFamily, fontSize }}
      handleFontDataChange={handleFontDataChange}
      textDisplayTheme={textDisplayTheme} />
    :
    <TextDisplayThemeSelector
      handleTextDisplayThemeChange={handleTextDisplayThemeChange}
      textDisplayTheme={textDisplayTheme} />;
  
  useLayoutEffect(() => {
    const popperAnchor = document.getElementById("formatFontBtt");
    setAnchorEl(popperAnchor);
  }, [])

  return(
    <Box className={classes.settingsWrapper} display="flex" justifyContent="flex-end" px={2}>
      <p>Paste the text here:</p>
      <TextInput handleTextChange={handleTextChange} name="textInput" type="text" value={text} />
      <IconButton className={classes.iconButton}>
        <Refresh />
      </IconButton>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div id="clickAwayWrapper">
          <IconButton className={classes.iconButton} id="formatFontBtt" onClick={e => handleClick(e.currentTarget.id)}>
            <FormatSize />
          </IconButton>
          <IconButton className={classes.iconButton} id="fontPaletteBtt" onClick={e => handleClick(e.currentTarget.id)}>
            <Palette />
          </IconButton>
          <PlaySettingsPopper
            anchorEl={anchorEl}
            children={popperContent}
            open={isPopperOpen}
            textDisplayTheme={textDisplayTheme} />
        </div>
      </ClickAwayListener>
    </Box>
  );
}
