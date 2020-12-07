import React from "react";
import { Grid, MenuItem, Select, Typography } from "@material-ui/core";
import { fontFamilies } from "../../../styles/textDisplayTheme/textDisplayData";
import { FontFamily } from "../../../types/types";

interface Props {
  activeFontFamily: FontFamily;
  handleFontFamilyChange: (fontFamily: FontFamily) => void;
}

export default function FontFaceSelector({ handleFontFamilyChange, activeFontFamily }: Props) {
  const MenuItemComponents = fontFamilies.map(({ name }) => {
    return <MenuItem key={name} value={name}>{name}</MenuItem>
  });

  return(
    <Grid justify="space-around" container>
      <Grid item>
        <Typography>Font face:</Typography>
      </Grid>
      <Grid item>
        <Select onChange={e => handleFontFamilyChange(e.target.value as FontFamily)} value={activeFontFamily}>
          {MenuItemComponents}
        </Select>
      </Grid>
    </Grid>
  );
}
