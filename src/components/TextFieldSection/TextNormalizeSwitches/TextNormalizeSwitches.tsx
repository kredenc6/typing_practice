import React from "react";
import { FormControlLabel, makeStyles, Switch } from "@material-ui/core";
import { AdjustText } from "../TextFieldSection";

interface Props {
  adjustText: AdjustText;
  setAdjustText: React.Dispatch<React.SetStateAction<AdjustText>>;
  handleSwitchChange: (propName: keyof AdjustText, boolean: boolean) => void;
  textInput: string;
}

const useStyles = makeStyles({
  switchWrapper: {
    display: "flex",
    flexFlow: "column"
  }
});

export default function TextNormalizeSwitches({
  adjustText,
  handleSwitchChange,
}: Props) {
  const classes = useStyles();
  return (
    <div className={classes.switchWrapper}>
      <FormControlLabel
        control={<Switch checked={adjustText.general.boolean} color="primary" disabled name="general" />}
        label="obecné úpravy textu"
        labelPlacement="end" />
      <FormControlLabel
        control={
          <Switch checked={adjustText.fromWiki.boolean} color="primary" onChange={e => {
            handleSwitchChange("fromWiki", e.target.checked);
          }} />}
        label="uprav text z wikipedie"
        labelPlacement="end" />
      <FormControlLabel
        control={
          <Switch
            checked={adjustText.forCzechKeyboard.boolean}
            color="primary"
            onChange={e => handleSwitchChange("forCzechKeyboard", e.target.checked)} />}
        label="uprav text pro českou klávesnici"
        labelPlacement="end" />
    </div>
  );
}
