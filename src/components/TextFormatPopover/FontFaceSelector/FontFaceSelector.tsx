import React from "react";
import { Grid, makeStyles, MenuItem, Select, Typography } from "@material-ui/core";
import { fontFamilies } from "../../../styles/textDisplayTheme/textDisplayData";
import { FontFamily } from "../../../types/types";

interface Props {
  activeFontFamily: FontFamily;
  handleFontFamilyChange: (fontFamily: FontFamily) => void;
}

const useStyles = makeStyles({
  select: {
    color: "inherit",
    "& .MuiSelect-icon": {
      color: "inherit"
    }
  }
});

export default function FontFaceSelector({ handleFontFamilyChange, activeFontFamily }: Props) {
  const classes = useStyles();
  const MenuItemComponents = fontFamilies.map(({ name }) => {
    return <MenuItem key={name} value={name}>{name}</MenuItem>
  });

  return(
    <Grid justify="space-around" container>
      <Grid item>
        <Typography>Font face:</Typography>
      </Grid>
      <Grid item>
        <Select className={classes.select} onChange={e => handleFontFamilyChange(e.target.value as FontFamily)} value={activeFontFamily}>
          {MenuItemComponents}
        </Select>
      </Grid>
    </Grid>
  );
}
