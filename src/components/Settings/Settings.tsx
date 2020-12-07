import React from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import TextInput from "../TextInput/TextInput";
import { Palette, Refresh, TextFormat } from "@material-ui/icons";
import ButtonIconPopover from "../ButtonIconPopover/ButtonIconPopover";
import TextFormatPopover from "../TextFormatPopover/TextFormatPopover";
import { FontData, RequireAtLeastOne } from "../../types/types";
import normalizeText from "../../textFunctions/normalizeText";


interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: RequireAtLeastOne<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}

const useStyles = makeStyles(({ palette }) => ({
  settingsWrapper: {
    padding: "0.5rem 1rem",
    border: `1px solid ${palette.divider}`
  }
}));

export default function Settings({ fontData, handleFontDataChange, setText, text }: Props) {
  const classes = useStyles();
  const handleTextChange = async (text: string) => {
    setText(await normalizeText(text));
  };

  const { fontFamily, fontSize } = fontData;

  return(
    <div className={classes.settingsWrapper}>
      <p>Paste the text here:</p>
      <TextInput handleTextChange={handleTextChange} name="textInput" type="text" value={text} />
      <ButtonIconPopover
        IconComponent={Palette}
        PopoverContent={
          <TextFormatPopover
            handleFontDataChange={handleFontDataChange}
            fontTheme={{ fontFamily, fontSize }} />
        } />
      <IconButton>
        <Refresh />
      </IconButton>
      <IconButton>
        <Palette />
      </IconButton>
      <IconButton>
        <TextFormat />
      </IconButton>
    </div>
  );
}
