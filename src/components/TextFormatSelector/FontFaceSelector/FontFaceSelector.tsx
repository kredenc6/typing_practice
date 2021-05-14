import React, { useLayoutEffect, useState } from "react";
import { ClickAwayListener, Grid, makeStyles, Popper, Typography } from "@material-ui/core";
import Spinner from "../../Spinner/Spinner";
import FakeSelect from "../../FakeSelect/FakeSelect";
import { fontFamilies } from "../../../styles/textDisplayTheme/textDisplayData";
import { FontFamily } from "../../../types/themeTypes";

interface Props {
  activeFontFamily: FontFamily;
  handleFontFamilyChange: (fontFamily: FontFamily) => void;
  isFontDataLoading: boolean;
}

const useStyles = makeStyles(({ palette, typography, textDisplayTheme }) => ({
  select: {
    color: "inherit",
    "& .MuiSelect-icon": {
      color: "inherit"
    }
  },
  popper: {
    display: "grid",
    gap: "1rem 1.5rem",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "1rem",
    backgroundColor: "white",
    border: `1px solid ${textDisplayTheme.text.secondary}`,
    zIndex: 3
  },
  fontFamilyItem: {
    padding: "0.5rem",
    color: "#555",
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
    padding: "0.5rem",
    color: palette.info.main,
    fontFamily: typography.fontFamily,
    borderBottom: `1px solid ${palette.info.main}`,
    cursor: "default"
  },
  selectDescription: {
    cursor: "default"
  }
}));

export default function FontFaceSelector({
  activeFontFamily, handleFontFamilyChange, isFontDataLoading
}: Props) {
  const classes = useStyles();
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
      <div key={name}>
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
        <Typography className={classes.selectDescription}>Font face:</Typography>
      </Grid>
      <Grid item>
        <ClickAwayListener onClickAway={() => handleClickaway(isPopperOpen)}>
          <div>
            <FakeSelect
              className={classes.select}
              id="faceSelectorPopperAnchor"
              onClick={handleClick}
              value={activeFontFamily} />
            <Popper
              anchorEl={anchorEl}
              className={classes.popper}
              modifiers={{ offset: { enabled: true, offset: "-100%p + 100%, 5" } }}
              open={isPopperOpen}
              placement="bottom-start"
            >
              {FontFamilyComponents}
              <Spinner isLoading={isFontDataLoading} />
            </Popper>
          </div>
        </ClickAwayListener>
      </Grid>
    </Grid>
  );
}
