import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import classNames from "classnames";
import { SortBy } from "../../types/otherTypes";

interface Props {
  sortBy: SortBy;
  handleSortChange: (value: SortBy) => void;
}

const useStyles = makeStyles(({palette}) => ({
  mistypedWordsFilter: {
    position: "absolute",
    top: 0,
    right: 0,
    display: "flex",
    gap: "1rem",
    padding: "0.2rem 0.5rem",
    borderLeft: `1px solid ${palette.divider}`,
    borderBottom: `1px solid ${palette.divider}`,
    borderBottomLeftRadius: "10px",
    background: palette.background.paper,
    zIndex: 1
  },
  filterOption: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem"
  },
  arrowWrapper: {
    display: "flex",
    flexFlow: "column"
  },
  arrowIcon: {
    fill: palette.text.primary,
    width: "1rem",
    height: "1rem",
    "&:hover": {
      cursor: "pointer"
    }
  },
  arrowIconActive: {
    fill: palette.info.main,
    "&:hover": {
      cursor: "default"
    }
  }
}));

export default function MistypedWordsSorter({ sortBy, handleSortChange }: Props) {
  const classes = useStyles();

  return (
    <Box className={classes.mistypedWordsFilter}>
      <Box className={classes.filterOption}>
        <Typography variant="body2">abecedně</Typography>
        <Box className={classes.arrowWrapper}>
          <KeyboardArrowUp
            className={classNames(classes.arrowIcon, sortBy==="alphabetical:asc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("alphabetical:asc")} />
          <KeyboardArrowDown
            className={classNames(classes.arrowIcon, sortBy==="alphabetical:desc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("alphabetical:desc")} />
        </Box>
      </Box>
      <Box className={classes.filterOption}>
        <Typography variant="body2">nedávné</Typography>
        <Box className={classes.arrowWrapper}>
          <KeyboardArrowUp
            className={classNames(classes.arrowIcon, sortBy==="byTime:asc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("byTime:asc")} />
          <KeyboardArrowDown
            className={classNames(classes.arrowIcon, sortBy==="byTime:desc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("byTime:desc")} />
        </Box>
      </Box>
      <Box className={classes.filterOption}>
        <Typography variant="body2">počet</Typography>
        <Box className={classes.arrowWrapper}>
          <KeyboardArrowUp
            className={classNames(classes.arrowIcon, sortBy==="byMistypeCount:asc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("byMistypeCount:asc")} />
          <KeyboardArrowDown 
            className={classNames(classes.arrowIcon, sortBy==="byMistypeCount:desc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("byMistypeCount:desc")} />
        </Box>
      </Box>
    </Box>
  );
}
