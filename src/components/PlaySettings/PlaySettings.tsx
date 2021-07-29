import React, { useContext, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClickAwayListener, IconButton, makeStyles } from "@material-ui/core";
import { FormatSize, Menu, Palette, Refresh, Settings } from "@material-ui/icons";
import TextFormatSelector from "../TextFormatSelector/TextFormatSelector";
import TextDisplayThemeSelector from "../TextDisplayThemeSelector/TextDisplayThemeSelector";
import MistypeSettings from "./MistypeSettings/MistypeSettings";
import PlaySettingsPopper from "./PlaySettingsPopper/PlaySettingsPopper";
import { FontData, TextDisplayTheme } from "../../types/themeTypes";
import { ThemeContext } from "../../styles/themeContext";
import { createUpdatedAppTheme } from "../../styles/appTheme";
import { AllowedMistype } from "../../types/otherTypes";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  restart: boolean;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
}

const useStyles = makeStyles(({ textDisplayTheme }) => ({
  header: {
    display: "grid",
    justifyContent: "space-between",
    alignItems: "center",
    gridTemplateColumns: "auto auto",
    padding: "0.5rem 4rem",
    backgroundColor: textDisplayTheme.background.secondary,
    color: textDisplayTheme.text.main,
    borderBottom: `1px solid ${textDisplayTheme.text.secondary}`
  },
  iconButton: {
    color: textDisplayTheme.text.secondary
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
  allowedMistype,
  setAllowedMistype
}: Props) {
  const classes = useStyles();
  const { state: theme, update: updateTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popperOpenedBy, setPopperOpenedBy] = useState("");
  
  const handleTextDisplayThemeChange = (newTheme: Omit<TextDisplayTheme, "offset">) => {
    const updatedTextDisplaytheme = { ...theme.textDisplayTheme, ...newTheme };
    const updatedAppTheme = createUpdatedAppTheme({ textDisplayTheme: updatedTextDisplaytheme });
    updateTheme(updatedAppTheme);
    localStorage.setItem("typingPracticeTextDisplayTheme", JSON.stringify(updatedTextDisplaytheme));
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
  const getPopperContent = () => {
    if(!isPopperOpen) return null;
    if(popperOpenedBy === "formatFontBtt") {
      return (
        <TextFormatSelector
          activeFontFamily={ fontFamily }
          activeFontSize={ fontSize }
          adjustSymbolRightMargin={adjustSymbolRightMargin}
          handleFontDataChange={handleFontDataChange}
          isFontDataLoading={isFontDataLoading} />
      );
    }
    if(popperOpenedBy === "fontPaletteBtt") {
      return (
        <TextDisplayThemeSelector
          handleTextDisplayThemeChange={handleTextDisplayThemeChange}
          textDisplayTheme={theme.textDisplayTheme} />
      );
    }
    if(popperOpenedBy === "gameSettings") {
      return (
        <MistypeSettings
          setAllowedMistype={setAllowedMistype}
          allowedMistype={allowedMistype} />
      );
    }
    return null;
  };

  const popperChildren = getPopperContent();
  
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
            <IconButton className={classes.iconButton} id="gameSettings" onClick={e => handleClick(e.currentTarget.id)}>
              <Settings />
            </IconButton>
            {
              popperChildren && // this prevents sending null as children (error)
                <PlaySettingsPopper
                  anchorEl={anchorEl}
                  children={popperChildren}
                  open={isPopperOpen} />
            }
          </div>
        </ClickAwayListener>
      </div>
    </header>
  );
}
