import React from "react";
import { Divider, makeStyles } from "@material-ui/core";
import FontSizeSelector from "./FontSizeSelector/FontSizeSelector";
import FontFaceSelector from "./FontFaceSelector/FontFaceSelector";
import { FontData, FontFamily, FontSize, FontStyle, RequireAtLeastOne, TextDisplayTheme } from "../../types/types";

interface Props {
  adjustSymbolRightMargin: (marginRight: string) => void;
  fontTheme: Pick<FontStyle, "fontFamily" | "fontSize">;
  handleFontDataChange: (fieldsToUpdate: RequireAtLeastOne<Pick<FontData, "fontFamily" | "fontSize">>, callback?: () => any) => Promise<void>;
  textDisplayTheme: TextDisplayTheme;
}

const useStyles = makeStyles({
  textFormat: {
    color: ({ palette }: TextDisplayTheme) => palette.text.secondary
  }
});

export default function TextFormatPopover({ adjustSymbolRightMargin, fontTheme, handleFontDataChange, textDisplayTheme }: Props) {
  const classes = useStyles(textDisplayTheme);

  const handleFontSizeChange = (fontSize: FontSize) => {
    const marginRight = determineRightMargin(fontSize);
    handleFontDataChange({fontSize}, () => adjustSymbolRightMargin(marginRight));
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    handleFontDataChange({fontFamily});
  };

  return(
    <div className={classes.textFormat}>
      <FontSizeSelector
        activeFontSize={fontTheme.fontSize}
        handleFontSizeChange={handleFontSizeChange} />
      <Divider />
      <FontFaceSelector activeFontFamily={fontTheme.fontFamily} handleFontFamilyChange={handleFontFamilyChange} />
    </div>
  );
}

function determineRightMargin(fontSize: FontSize) {
  return fontSize === "40px" ? "2px" : "1px";
}
