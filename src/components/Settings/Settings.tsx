import React from "react";
import { IconButton, makeStyles } from "@material-ui/core";
import TextInput from "../TextInput/TextInput";
import { Palette, Refresh, TextFormat } from "@material-ui/icons";
import ButtonIconPopover from "../ButtonIconPopover/ButtonIconPopover";
import TextFormatPopover from "../TextFormatPopover/TextFormatPopover";
import { FontStyle } from "../../types/types";
import normalizeText from "../../textFunctions/normalizeText";


interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  setTextDisplayTheme: React.Dispatch<React.SetStateAction<FontStyle>>;
  text: string;
  textDisplayTheme: FontStyle;
}

const useStyles = makeStyles({
  settingsWrapper: {
    padding: "0.5rem 1rem",
    border: "1px solid #555"
  }
});

export default function Settings({ setText, setTextDisplayTheme, text, textDisplayTheme }: Props) {
  const classes = useStyles();
  const handleTextChange = async (text: string) => {
    setText(await normalizeText(text));
  };

  return(
    <div className={classes.settingsWrapper}>
      <p>Paste the text here:</p>
      <TextInput handleTextChange={handleTextChange} name="textInput" type="text" value={text} />
      <ButtonIconPopover
        IconComponent={Palette}
        PopoverContent={
          <TextFormatPopover
            setTextDisplayTheme={setTextDisplayTheme}
            textDisplayTheme={textDisplayTheme} />
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
