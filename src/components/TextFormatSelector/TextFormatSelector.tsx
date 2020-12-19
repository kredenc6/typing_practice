import React from "react";
import { Divider, makeStyles } from "@material-ui/core";
import FontSizeSelector from "./FontSizeSelector/FontSizeSelector";
import FontFaceSelector from "./FontFaceSelector/FontFaceSelector";
import { FontData, FontFamily, FontSize, TextDisplayTheme } from "../../types/types";

interface Props {
  activeFontFamily: FontFamily;
  activeFontSize: FontSize;
  adjustSymbolRightMargin: (marginRight: string) => void;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>, callback?: () => any) => Promise<void>;
  textDisplayTheme: TextDisplayTheme;
}

const useStyles = makeStyles({
  textFormat: {
    color: ({ palette }: TextDisplayTheme) => palette.text.secondary
  }
});

export default function TextFormatSelector({
  activeFontFamily,
  activeFontSize,
  adjustSymbolRightMargin,
  handleFontDataChange,
  textDisplayTheme
}: Props) {
  const classes = useStyles(textDisplayTheme);

  const handleFontSizeChange = (fontSize: FontSize) => {
    const marginRight = determineRightMargin(fontSize);
    handleFontDataChange({ fontSize }, () => adjustSymbolRightMargin(marginRight));
  };

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    handleFontDataChange({ fontFamily });
  };

  return(
    <div className={classes.textFormat}>
      <FontSizeSelector
        activeFontSize={activeFontSize}
        handleFontSizeChange={handleFontSizeChange} />
      <Divider />
      <FontFaceSelector
        activeFontFamily={activeFontFamily}
        handleFontFamilyChange={handleFontFamilyChange}
        textDisplayTheme={textDisplayTheme} />
    </div>
  );
}

function determineRightMargin(fontSize: FontSize) {
  return fontSize === "40px" ? "2px" : "1px";
}
