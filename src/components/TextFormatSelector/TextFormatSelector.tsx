import { useContext } from "react";
import { Box, Divider } from "@mui/material";
import FontSizeSelector from "./FontSizeSelector/FontSizeSelector";
import FontFaceSelector from "./FontFaceSelector/FontFaceSelector";
import { FontData, FontFamily, FontSize } from "../../types/themeTypes";
import { PlayPageThemeContext } from "../../styles/themeContexts";

interface Props {
  activeFontFamily: FontFamily;
  activeFontSize: FontSize;
  adjustSymbolRightMargin: (marginRight: string) => void;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>, callback?: () => any) => Promise<void>;
  isFontDataLoading: boolean;
}

export default function TextFormatSelector({
  activeFontFamily,
  activeFontSize,
  adjustSymbolRightMargin,
  handleFontDataChange,
  isFontDataLoading
}: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);

  const handleFontSizeChange = (fontSize: FontSize) => {
    const marginRight = determineRightMargin(fontSize);
    handleFontDataChange({ fontSize }, () => adjustSymbolRightMargin(marginRight));
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    handleFontDataChange({ fontFamily });
  };

  return(
    <Box sx={{ color: textDisplayTheme.text.secondary }}>
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
