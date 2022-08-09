import { Box, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { SortBy } from "../../types/otherTypes";
import { CSSObjectFunctionsWithProp, CSSObjects } from "../../types/themeTypes";

interface Props {
  sortBy: SortBy;
  handleSortChange: (value: SortBy) => void;
}

const styles:CSSObjects = {
  mistypedWordsFilter: ({ palette }) => ({
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
  }),
  filterOption: {
    display: "flex",
    alignItems: "center",
    gap: "0.3rem"
  },
  arrowWrapper: {
    display: "flex",
    flexFlow: "column"
  }
};

const styleFunctions: CSSObjectFunctionsWithProp = {
  arrowIcon: ({ palette }, prop) => {
    const isActive = prop;

    return {
      fill: isActive ? palette.info.main : palette.text.primary,
      width: "1rem",
      height: "1rem",
      "&:hover": {
        cursor: isActive ? "default" : "pointer"
      }
    }
  }
};

export default function MistypedWordsSorter({ sortBy, handleSortChange }: Props) {
  return (
    <Box sx={styles.mistypedWordsFilter}>
      <Box sx={styles.filterOption}>
        <Typography variant="body2">abecedně</Typography>
        <Box sx={styles.arrowWrapper}>
          <KeyboardArrowUp
            sx={theme => styleFunctions.arrowIcon(theme, sortBy === "alphabetical:asc")}
            onClick={() => handleSortChange("alphabetical:asc")} />
          <KeyboardArrowDown
            sx={theme => styleFunctions.arrowIcon(theme, sortBy === "alphabetical:desc") }
            onClick={() => handleSortChange("alphabetical:desc")} />
        </Box>
      </Box>
      <Box sx={styles.filterOption}>
        <Typography variant="body2">nedávné</Typography>
        <Box sx={styles.arrowWrapper}>
          <KeyboardArrowUp
            sx={theme => styleFunctions.arrowIcon(theme, sortBy === "byTime:asc") }
            onClick={() => handleSortChange("byTime:asc")} />
          <KeyboardArrowDown
            sx={ theme => styleFunctions.arrowIcon(theme, sortBy === "byTime:desc") }
            onClick={() => handleSortChange("byTime:desc")} />
        </Box>
      </Box>
      <Box sx={styles.filterOption}>
        <Typography variant="body2">počet</Typography>
        <Box sx={styles.arrowWrapper}>
          <KeyboardArrowUp
            sx={theme => styleFunctions.arrowIcon(theme, sortBy === "byMistypeCount:asc") }
            onClick={() => handleSortChange("byMistypeCount:asc")} />
          <KeyboardArrowDown 
            sx={theme => styleFunctions.arrowIcon(theme, sortBy === "byMistypeCount:desc") }
            onClick={() => handleSortChange("byMistypeCount:desc")} />
        </Box>
      </Box>
    </Box>
  );
}
