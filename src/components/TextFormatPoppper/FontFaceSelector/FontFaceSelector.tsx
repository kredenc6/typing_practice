import React, { useLayoutEffect, useState } from "react";
import { ClickAwayListener, Grid, makeStyles, Popper, Typography } from "@material-ui/core";
import { fontFamilies } from "../../../styles/textDisplayTheme/textDisplayData";
import { FontFamily, TextDisplayTheme } from "../../../types/types";

import FakeSelect from "../../FakeSelect/FakeSelect";

interface Props {
  activeFontFamily: FontFamily;
  handleFontFamilyChange: (fontFamily: FontFamily) => void;
  textDisplayTheme: TextDisplayTheme;
}

const useStyles = makeStyles(({ palette, typography }) => ({
  select: {
    color: "inherit",
    "& .MuiSelect-icon": {
      color: "inherit"
    }
  },
  popper: {
    display: "grid",
    gap: "10px 15px",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "15px",
    backgroundColor: ({ palette }: TextDisplayTheme) => palette.background.secondary
  },
  fontFamilyItem: {
    padding: "5px",
    color: ({ palette }: TextDisplayTheme) => palette.text.secondary,
    fontFamily: typography.fontFamily,
    borderBottom: "1px solid transparent",
    transition: "all 0.2s",
    "&:hover": {
      cursor: "pointer",
      color: palette.info.main,
      borderBottom: `1px solid ${palette.info.main}`
    }
  },
  selectedFontFamilyItem: {
    padding: "5px",
    color: palette.info.main,
    fontFamily: typography.fontFamily,
    borderBottom: `1px solid ${palette.info.main}`,
    cursor: "default"
  }
}));

export default function FontFaceSelector({ activeFontFamily, handleFontFamilyChange, textDisplayTheme }: Props) {
  const classes = useStyles(textDisplayTheme);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const handleClick = () => {
    setIsPopperOpen(!isPopperOpen);
  };
  const handleClickaway = (isPopperOpened: boolean) => {
    if(isPopperOpened) {
      setIsPopperOpen(false);
    }
  };
  const FontFamilyComponents = fontFamilies.map(({ name }) => {
    return (
      <div>
        {
          activeFontFamily === name ?
            <span className={classes.selectedFontFamilyItem} key={name}>{name}</span>
            :
            <span
              className={classes.fontFamilyItem}
              key={name}
              onClick={() => handleFontFamilyChange(name)}
            >
              {name}
            </span>
        }
      </div>
    );
  });

  useLayoutEffect(() => {
    const anchorElementNode = document.getElementById("faceSelectorPopperAnchor");
    setAnchorEl(anchorElementNode);
  },[])

  return(
    <Grid alignItems="center" justify="space-around" container>
      <Grid item>
        <Typography>Font face:</Typography>
      </Grid>
      <Grid item>
        <ClickAwayListener onClickAway={() => handleClickaway(isPopperOpen)}>
          <div>
            <FakeSelect
              className={classes.select}
              id="faceSelectorPopperAnchor"
              onClick={handleClick}
              textDisplayTheme={textDisplayTheme}
              value={activeFontFamily} />
            <Popper
              anchorEl={anchorEl}
              className={classes.popper}
              modifiers={{ offset: { enabled: true, offset: "-100%p + 100%, 5" } }}
              open={isPopperOpen}
              placement="bottom-start">
              {FontFamilyComponents}
            </Popper>
          </div>
        </ClickAwayListener>
      </Grid>
    </Grid>
  );
}
