import React from "react";
import { Divider } from "@material-ui/core";
import FontSizeSelector from "./FontSizeSelector/FontSizeSelector";
import FontFaceSelector from "./FontFaceSelector/FontFaceSelector";
import { FontData, FontFamily, FontSize, FontStyle, RequireAtLeastOne } from "../../types/types";

interface Props {
  handleFontDataChange: (fieldsToUpdate: RequireAtLeastOne<Pick<FontData, "fontFamily" | "fontSize">>, callback?: () => any) => Promise<void>;
  adjustSymbolRightMargin: (marginRight: string) => void;
  fontTheme: Pick<FontStyle, "fontFamily" | "fontSize">;
}

export default function TextFormatPopover({ handleFontDataChange, adjustSymbolRightMargin, fontTheme }: Props) {
  const handleFontSizeChange = (fontSize: FontSize) => {
    const marginRight = determineRightMargin(fontSize);
    handleFontDataChange({fontSize}, () => adjustSymbolRightMargin(marginRight));
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    handleFontDataChange({fontFamily});
  };

  return(
    <>
      <FontSizeSelector
        activeFontSize={fontTheme.fontSize}
        handleFontSizeChange={handleFontSizeChange} />
      <Divider />
      <FontFaceSelector activeFontFamily={fontTheme.fontFamily} handleFontFamilyChange={handleFontFamilyChange} />
    </>
  );
}

function determineRightMargin(fontSize: FontSize) {
  return fontSize === "40px" ? "2px" : "1px";
}
