import React, { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClickAwayListener, IconButton, makeStyles } from "@material-ui/core";
import { FormatSize, Menu, Palette, Refresh } from "@material-ui/icons";
import TextFormatSelector from "../TextFormatSelector/TextFormatSelector";
import TextDisplayThemeSelector from "../TextDisplayThemeSelector/TextDisplayThemeSelector";
import PlaySettingsPopper from "./PlaySettingsPopper/PlaySettingsPopper";
import { FontData, TextDisplayTheme } from "../../types/types";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  restart: boolean;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  setTextDisplayTheme: React.Dispatch<React.SetStateAction<TextDisplayTheme>>
  textDisplayTheme: TextDisplayTheme;
}

const useStyles = makeStyles({
  header: {
    display: "grid",
    justifyContent: "space-between",
    alignItems: "center",
    gridTemplateColumns: "auto auto",
    padding: "0.5rem 4rem",
    backgroundColor: ({ palette }: TextDisplayTheme) => palette.background.secondary,
    color: ({ palette }: TextDisplayTheme) => palette.text.secondary,
    borderBottom: ({ palette }: TextDisplayTheme) => `1px solid ${palette.text.secondary}`
  },
  iconButton: {
    color: ({ palette }: TextDisplayTheme) => palette.text.secondary
  },
  clickAwayWrapper: {
    display: "inline-block"
  }
});

export default function PlaySettings({
  fontData,
  handleFontDataChange,
  isFontDataLoading,
  restart,
  setRestart,
  setTextDisplayTheme,
  textDisplayTheme
}: Props) {
  const classes = useStyles(textDisplayTheme);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popperOpenedBy, setPopperOpenedBy] = useState("");
  
  const handleTextDisplayThemeChange = (fieldsToUpdate: Partial<TextDisplayTheme>) => {
    setTextDisplayTheme(prev => ({ ...prev, ...fieldsToUpdate }));
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
    <TextFormatSelector
      activeFontFamily={ fontFamily }
      activeFontSize={ fontSize }
      adjustSymbolRightMargin={adjustSymbolRightMargin}
      handleFontDataChange={handleFontDataChange}
      isFontDataLoading={isFontDataLoading}
      textDisplayTheme={textDisplayTheme} />
    :
    <TextDisplayThemeSelector
      handleTextDisplayThemeChange={handleTextDisplayThemeChange}
      textDisplayTheme={textDisplayTheme} />;
  
  useLayoutEffect(() => {
    const popperAnchor = document.getElementById("playSettingsHeader");
    setAnchorEl(popperAnchor);
  }, [])

  return(
    <header className={classes.header} id="playSettingsHeader">
      <Link to="/mainMenu">
        <Menu className={classes.iconButton} />
      </Link>
      <div>
        <IconButton className={classes.iconButton} disabled={restart} onClick={() => setRestart(true)}>
          <Refresh />
        </IconButton>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className={classes.clickAwayWrapper} id="clickAwayWrapper">
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
      </div>
    </header>
  );
}
