import React, { useContext, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClickAwayListener, IconButton, makeStyles } from "@material-ui/core";
import { FormatSize, Menu, Palette, Refresh } from "@material-ui/icons";
import TextFormatSelector from "../TextFormatSelector/TextFormatSelector";
import TextDisplayThemeSelector from "../TextDisplayThemeSelector/TextDisplayThemeSelector";
import PlaySettingsPopper from "./PlaySettingsPopper/PlaySettingsPopper";
import { FontData, TextDisplayTheme } from "../../types/themeTypes";
import { ThemeContext } from "../../styles/themeContext";
import { createUpdatedAppTheme } from "../../styles/appTheme";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  restart: boolean;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
}

const useStyles = makeStyles(({ textDisplayTheme, palette }) => ({
  header: {
    display: "grid",
    justifyContent: "space-between",
    alignItems: "center",
    gridTemplateColumns: "auto auto",
    padding: "0.5rem 4rem",
    backgroundColor: textDisplayTheme.background.secondary,
    color: palette.secondary.contrastText,
    borderBottom: `1px solid ${palette.secondary.contrastText}`
  },
  iconButton: {
    color: palette.secondary.contrastText
  },
  clickAwayWrapper: {
    display: "inline-block"
  }
}));

export default function PlaySettings({
  fontData,
  handleFontDataChange,
  isFontDataLoading,
  restart,
  setRestart,
}: Props) {
  const classes = useStyles();
  const { state: theme, update: updateTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popperOpenedBy, setPopperOpenedBy] = useState("");
  
  const handleTextDisplayThemeChange = (newTheme: Omit<TextDisplayTheme, "offset">) => {
    const updatedTextDisplaytheme = { ...theme.textDisplayTheme, ...newTheme };
    const updatedAppTheme = createUpdatedAppTheme({ textDisplayTheme: updatedTextDisplaytheme });
    updateTheme(updatedAppTheme);
  };

  const adjustSymbolRightMargin = (marginRight: string) => {
    const updatedTextDisplaytheme = { ...theme.textDisplayTheme };
    updatedTextDisplaytheme.offset.symbol.marginRight = marginRight;
    
    const updatedAppTheme = createUpdatedAppTheme({ textDisplayTheme: updatedTextDisplaytheme });
    updateTheme(updatedAppTheme);
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
      isFontDataLoading={isFontDataLoading} />
    :
    <TextDisplayThemeSelector
      handleTextDisplayThemeChange={handleTextDisplayThemeChange}
      textDisplayTheme={theme.textDisplayTheme} />;
  
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
              open={isPopperOpen} />
          </div>
        </ClickAwayListener>
      </div>
    </header>
  );
}
