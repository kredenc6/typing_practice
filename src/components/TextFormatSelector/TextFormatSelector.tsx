import React, { useContext } from "react";
import { Box, Divider, makeStyles } from "@material-ui/core";
import FontSizeSelector from "./FontSizeSelector/FontSizeSelector";
import FontFaceSelector from "./FontFaceSelector/FontFaceSelector";
import { FontData, FontFamily, FontSize, TextDisplayTheme } from "../../types/themeTypes";
import { PlayPageThemeContext } from "../../styles/themeContexts";

interface Props {
  activeFontFamily: FontFamily;
  activeFontSize: FontSize;
  adjustSymbolRightMargin: (marginRight: string) => void;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>, callback?: () => any) => Promise<void>;
  isFontDataLoading: boolean;
}

const useStyles = makeStyles({
  textFormat: {
    color: (textDisplayTheme: TextDisplayTheme) => textDisplayTheme.text.secondary
  }
});

export default function TextFormatSelector({
  activeFontFamily,
  activeFontSize,
  adjustSymbolRightMargin,
  handleFontDataChange,
  isFontDataLoading
}: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);
  const classes = useStyles(textDisplayTheme);

  const handleFontSizeChange = (fontSize: FontSize) => {
    const marginRight = determineRightMargin(fontSize);
    handleFontDataChange({ fontSize }, () => adjustSymbolRightMargin(marginRight));
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    handleFontDataChange({ fontFamily });
  };

  return(
    <Box className={classes.textFormat}>
      <FontSizeSelector
        activeFontSize={activeFontSize}
        handleFontSizeChange={handleFontSizeChange} />
      <Divider />
      <FontFaceSelector
        activeFontFamily={activeFontFamily}
        handleFontFamilyChange={handleFontFamilyChange}
        isFontDataLoading={isFontDataLoading} />
    </Box>
  );
}

function determineRightMargin(fontSize: FontSize) {
  return fontSize === "40px" ? "2px" : "1px";
}
