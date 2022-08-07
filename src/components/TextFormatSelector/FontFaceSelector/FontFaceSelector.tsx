import { useContext, useState } from "react";
import { Box, ClickAwayListener, Grid, Popper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Spinner from "../../Spinner/Spinner";
import FakeSelect from "../../FakeSelect/FakeSelect";
import { fontFamilies } from "../../../styles/textDisplayTheme/textDisplayData";
import { FontFamily, TextDisplayTheme } from "../../../types/themeTypes";
import { PlayPageThemeContext } from "../../../styles/themeContexts";

interface Props {
  activeFontFamily: FontFamily;
  handleFontFamilyChange: (fontFamily: FontFamily) => void;
  isFontDataLoading: boolean;
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
    gap: "1rem 1.5rem",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "1rem",
    backgroundColor: "white",
    border: (textDisplayTheme: TextDisplayTheme) => `1px solid ${textDisplayTheme.text.secondary}`,
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
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);
  const classes = useStyles(textDisplayTheme);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isPopperOpened, setIsPopperOpened] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(!anchorEl) {
      setAnchorEl(e.currentTarget);
    }

    setIsPopperOpened(prev => !prev);
  };

  const handleClickaway = () => {
    if(isPopperOpened) {
      setIsPopperOpened(false);
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

  return(
    <Grid alignItems="center" justifyContent="space-around" container>
      <Grid item>
        <Typography className={classes.selectDescription}>Typ fontu:</Typography>
      </Grid>
      <Grid item>
        <ClickAwayListener onClickAway={handleClickaway}>
          <Box>
            <FakeSelect
              className={classes.select}
              id="faceSelectorPopperAnchor"
              onClick={handleClick}
              value={activeFontFamily} />
            <Popper
              id="font-selentor--popper"
              anchorEl={anchorEl}
              className={classes.popper}
              modifiers={[ { name: "offset", enabled: true, options: { offset: [0, 5]} } ]}
              open={isPopperOpened}
              placement="bottom-start"
            >
              {FontFamilyComponents}
              <Spinner isLoading={isFontDataLoading} />
            </Popper>
          </Box>
        </ClickAwayListener>
      </Grid>
    </Grid>
  );
}
