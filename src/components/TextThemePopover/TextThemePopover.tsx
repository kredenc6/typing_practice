import React from "react";
import TextDisplayThemeSelector from "./TextDisplayThemeSelector/TextDisplayThemeSelector";
import { TextDisplayTheme } from "../../types/types";

interface Props {
  handleTextDisplayThemeChange: (fieldChanges: Partial<TextDisplayTheme>) => void;
  textDisplayTheme: TextDisplayTheme;
}

export default function TextThemePopover({ handleTextDisplayThemeChange, textDisplayTheme }: Props) {
  return(
    <>
      <TextDisplayThemeSelector handleTextDisplayThemeChange={handleTextDisplayThemeChange} />
    </>
  );
}
