import React from "react";
import { FormControlLabel, makeStyles, Switch } from "@material-ui/core";
import normalizeTextFromWiki from "../../../textFunctions/normalizeTextFromWiki";
import normalizeTextForCzechKeyboard from "../../../textFunctions/normalizeTextForCzechKeyboard";

interface Props {
  czechKeyboardNormalize: boolean;
  generalNormalize: boolean;
  handleSwitchChange: (adjustedText: string) => void;
  setCzechKeyboardNormalize: React.Dispatch<React.SetStateAction<boolean>>;
  setWikiNormalize: React.Dispatch<React.SetStateAction<boolean>>;
  textInput: string;
  wikiNormalize: boolean;
}

const useStyles = makeStyles({
  switchWrapper: {
    display: "flex",
    flexFlow: "column"
  }
});

export default function TextNormalizeSwitches({
  czechKeyboardNormalize,
  generalNormalize,
  handleSwitchChange,
  setCzechKeyboardNormalize,
  setWikiNormalize,
  textInput,
  wikiNormalize
}: Props) {
  const classes = useStyles();
  return (
    <div className={classes.switchWrapper}>
      <FormControlLabel
        control={<Switch checked={generalNormalize} color="primary" disabled name="general" />}
        label="general text adjustment"
        labelPlacement="end" />
      <FormControlLabel
        control={
          <Switch checked={wikiNormalize} color="primary" onChange={e => {
            if(e.target.checked) {
              const adjustedText = normalizeTextFromWiki(textInput);
              handleSwitchChange(adjustedText);
            }
            setWikiNormalize(!wikiNormalize);
          }} />}
        label="adjust text from wikipedia"
        labelPlacement="end" />
      <FormControlLabel
        control={
          <Switch checked={czechKeyboardNormalize} color="primary" onChange={e => {
            if(e.target.checked) {
              const adjustedText = normalizeTextForCzechKeyboard(textInput);
              handleSwitchChange(adjustedText);
            }
            setCzechKeyboardNormalize(!czechKeyboardNormalize);
          }} />}
        label="adjust text for czech keyboard"
        labelPlacement="end" />
    </div>
  );
}
