import React from "react";
import { Divider } from "@material-ui/core";
import FontSizeSelector from "./FontSizeSelector/FontSizeSelector";
import FontFaceSelector from "./FontFaceSelector/FontFaceSelector";
import { FontData, FontFamily, FontSize, FontStyle, RequireAtLeastOne } from "../../types/types";

interface Props {
  handleFontDataChange: (fieldsToUpdate: RequireAtLeastOne<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  fontTheme: Pick<FontStyle, "fontFamily" | "fontSize">;
}

export default function TextFormatPopover({ handleFontDataChange, fontTheme }: Props) {
  const handleFontSizeChange = (fontSize: FontSize) => {
    handleFontDataChange({fontSize});
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    handleFontDataChange({fontFamily});
  };

  return(
    <>
      <FontSizeSelector activeFontSize={fontTheme.fontSize} handleFontSizeChange={handleFontSizeChange} />
      <Divider />
      <FontFaceSelector activeFontFamily={fontTheme.fontFamily} handleFontFamilyChange={handleFontFamilyChange} />
    </>
  );
}

// Žump, Žíňka, Život, Žížala