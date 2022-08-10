import React, { useContext, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, ClickAwayListener, IconButton } from "@mui/material";
import { FormatSize, Menu, Palette, Refresh, Settings } from "@mui/icons-material";
import TextFormatSelector from "../TextFormatSelector/TextFormatSelector";
import TextDisplayThemeSelector from "../TextDisplayThemeSelector/TextDisplayThemeSelector";
import MistypeSettings from "./MistypeSettings/MistypeSettings";
import PlaySettingsPopper from "./PlaySettingsPopper/PlaySettingsPopper";
import { FontData, TextDisplayTheme } from "../../types/themeTypes";
import { PlayPageThemeContext } from "../../styles/themeContexts";
import { AllowedMistype } from "../../types/otherTypes";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  restart: boolean;
  setRestart: React.Dispatch<React.SetStateAction<boolean>>;
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
}

export default function PlaySettings({
  fontData,
  handleFontDataChange,
  isFontDataLoading,
  restart,
  setRestart,
  allowedMistype,
  setAllowedMistype
}: Props) {
  const { state: textDisplayTheme, update: updateTextDisplayTheme } = useContext(PlayPageThemeContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popperOpenedBy, setPopperOpenedBy] = useState("");
  
  const handleTextDisplayThemeChange = (newTheme: Omit<TextDisplayTheme, "offset">) => {
    const updatedTextDisplaytheme = { ...textDisplayTheme, ...newTheme };
    updateTextDisplayTheme(updatedTextDisplaytheme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEXT_DISPLAY_THEME, JSON.stringify(updatedTextDisplaytheme));
  };

  const adjustSymbolRightMargin = (marginRight: string) => {
    const updatedTextDisplaytheme = { ...textDisplayTheme };
    updatedTextDisplaytheme.offset.symbol.marginRight = marginRight;
    
    updateTextDisplayTheme(updatedTextDisplaytheme);
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
          textDisplayTheme={textDisplayTheme} />
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
    <Box
      component="header"
      sx={{
        display: "grid",
        justifyContent: "space-between",
        alignItems: "center",
        gridTemplateColumns: "auto auto",
        padding: "0.5rem 4rem",
        backgroundColor: textDisplayTheme.background.secondary,
        color: textDisplayTheme.text.main,
        borderBottom: `1px solid ${textDisplayTheme.text.secondary}`
      }}
      id="playSettingsHeader"
    >
      <Link to="/mainMenu">
        <Menu sx={{ color: textDisplayTheme.text.secondary }} />
      </Link>
      <Box>
        <IconButton sx={{ color: textDisplayTheme.text.secondary }} disabled={restart} onClick={() => setRestart(true)}>
          <Refresh />
        </IconButton>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ display: "inline-block" }} id="clickAwayWrapper">
            <IconButton sx={{ color: textDisplayTheme.text.secondary }} id="formatFontBtt" onClick={e => handleClick(e.currentTarget.id)}>
              <FormatSize />
            </IconButton>
            <IconButton sx={{ color: textDisplayTheme.text.secondary }} id="fontPaletteBtt" onClick={e => handleClick(e.currentTarget.id)}>
              <Palette />
            </IconButton>
            <IconButton sx={{ color: textDisplayTheme.text.secondary }} id="gameSettings" onClick={e => handleClick(e.currentTarget.id)}>
              <Settings />
            </IconButton>
            {
              popperChildren && // this prevents sending null as children (error)
                <PlaySettingsPopper
                  anchorEl={anchorEl}
                  children={popperChildren}
                  open={isPopperOpen} />
            }
          </Box>
        </ClickAwayListener>
      </Box>
    </Box>
  );
}
