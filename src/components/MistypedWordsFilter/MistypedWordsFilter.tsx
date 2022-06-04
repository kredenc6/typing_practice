import { Box, makeStyles, Typography } from "@material-ui/core";
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

export default function MistypedWordsFilter({ sortBy, handleSortChange }: Props) {
  const classes = useStyles();

  return (
    <Box className={classes.mistypedWordsFilter}>
      <Box className={classes.filterOption}>
        <Typography variant="body2">nedávné</Typography>
        <Box className={classes.arrowWrapper}>
          <KeyboardArrowUp
            className={classNames(classes.arrowIcon, sortBy==="time:asc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("time:asc")} />
          <KeyboardArrowDown
            className={classNames(classes.arrowIcon, sortBy==="time:desc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("time:desc")} />
        </Box>
      </Box>
      <Box className={classes.filterOption}>
        <Typography variant="body2">počet</Typography>
        <Box className={classes.arrowWrapper}>
          <KeyboardArrowUp
            className={classNames(classes.arrowIcon, sortBy==="count:asc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("count:asc")} />
          <KeyboardArrowDown 
            className={classNames(classes.arrowIcon, sortBy==="count:desc" && classes.arrowIconActive) }
            onClick={() => handleSortChange("count:desc")} />
        </Box>
      </Box>
    </Box>
  );
}
