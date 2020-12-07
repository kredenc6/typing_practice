import React from "react";
import { Grid, MenuItem, Select, Typography } from "@material-ui/core";
import { fontFamilies } from "../../../styles/textDisplayTheme/textDisplayTheme";
import { FontFamily } from "../../../types/types";

interface Props {
  fontFamily: FontFamily;
  handleFontFamilyChange: (fontFamily: FontFamily) => void;
}

export default function FontFaceSelector({ handleFontFamilyChange, fontFamily }: Props) {
  const MenuItemComponents = fontFamilies.map(({ name }) => {
    return <MenuItem key={name} value={name}>{name}</MenuItem>
  });

  return(
    <Grid justify="space-around" container>
      <Grid item>
        <Typography>Font face:</Typography>
      </Grid>
      <Grid item>
        <Select onChange={e => handleFontFamilyChange(e.target.value as FontFamily)} value={fontFamily}>
          {MenuItemComponents}
        </Select>
      </Grid>
    </Grid>
  );
}
