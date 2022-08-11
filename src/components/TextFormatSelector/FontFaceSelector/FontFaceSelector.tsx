import { useContext, useState } from "react";
import { Box, ClickAwayListener, Grid, Popper, Typography } from "@mui/material";
import Spinner from "../../Spinner/Spinner";
import FakeSelect from "../../FakeSelect/FakeSelect";
import { fontFamilies } from "../../../styles/textDisplayTheme/textDisplayData";
import { CSSObjectFunctionsWithProp, CSSObjects, FontFamily, TextDisplayTheme } from "../../../types/themeTypes";
import { PlayPageThemeContext } from "../../../styles/themeContexts";

interface Props {
  activeFontFamily: FontFamily;
  handleFontFamilyChange: (fontFamily: FontFamily) => void;
  isFontDataLoading: boolean;
}

const styles: CSSObjects = {
  select: {
    color: "inherit",
    "& .MuiSelect-icon": {
      color: "inherit"
    }
  },
  fontFamilyItem: ({ palette, typography }) => ({
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
  }),
  selectedFontFamilyItem: ({ palette, typography }) => ({
    padding: "0.5rem",
    color: palette.info.main,
    fontFamily: typography.fontFamily,
    borderBottom: `1px solid ${palette.info.main}`,
    cursor: "default"
  }),
  selectDescription: {
    cursor: "default"
  }
};

const styleFunctions: CSSObjectFunctionsWithProp = {
  popper: (_, prop) => {
    const textDisplayTheme = prop as TextDisplayTheme;

    return {
      display: "grid",
      gap: "1rem 1.5rem",
      gridTemplateColumns: "1fr 1fr 1fr",
      padding: "1rem",
      backgroundColor: "white",
      border: `1px solid ${textDisplayTheme.text.secondary}`,
      zIndex: 3
    }
  }
};

export default function FontFaceSelector({
  activeFontFamily, handleFontFamilyChange, isFontDataLoading
}: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext);
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
      <Box key={name}>
        {
          activeFontFamily === name ?
            <Box component="span" sx={styles.selectedFontFamilyItem} key={name}>
              {name}
            </Box>
            :
            <Box
              component="span"
              sx={styles.fontFamilyItem}
              key={name}
              onClick={() => handleFontFamilyChange(name)}
            >
              {name}
            </Box>
        }
      </Box>
    );
  });

  return(
    <Grid alignItems="center" justifyContent="space-around" container>
      <Grid item>
        <Typography sx={styles.selectDescription}>Typ fontu:</Typography>
      </Grid>
      <Grid item>
        <ClickAwayListener onClickAway={handleClickaway}>
          <Box>
            <FakeSelect
              sx={styles.select}
              id="faceSelectorPopperAnchor"
              onClick={handleClick}
              value={activeFontFamily} />
            <Popper
              id="font-selentor--popper"
              anchorEl={anchorEl}
              sx={theme => styleFunctions.popper(theme, textDisplayTheme)}
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
