import React from "react";
import { Divider } from "@material-ui/core";
import FontSizeSelector from "./FontSizeSelector/FontSizeSelector";
import FontFaceSelector from "./FontFaceSelector/FontFaceSelector";
import { FontFamily, FontSize, FontStyle } from "../../types/types";

interface Props {
  setTextDisplayTheme: React.Dispatch<React.SetStateAction<FontStyle>>;
  textDisplayTheme: FontStyle;
}

export default function TextFormatPopover({ setTextDisplayTheme, textDisplayTheme }: Props) {
  const handleFontSizeChange = (fontSize: FontSize) => {
    setTextDisplayTheme(prev => ({ ...prev, fontSize }));
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    setTextDisplayTheme(prev => ({ ...prev, fontFamily }));
  };

  return(
    <>
      <FontSizeSelector handleFontSizeChange={handleFontSizeChange} textDisplayTheme={textDisplayTheme} />
      <Divider />
      <FontFaceSelector handleFontFamilyChange={handleFontFamilyChange} fontFamily={textDisplayTheme.fontFamily} />
    </>
  );
}
