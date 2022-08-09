import { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, TextField } from "@mui/material";
import MistypedWordsSorter from "../MistypedWordsSorter/MistypedWordsSorter";
import MistypedWordsChart from "../MistypedWordsChart/MistypedWordsChart";
import { MistypedWordsLogV2, SortBy } from "../../types/otherTypes";
import { getFilteredMistypeWordIndexes, getMistypedWordsChartHeight, sortMistypedWords, transformMistypeWordsToSeries } from "../../pages/Statistics/helpFunction";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";
import { CSSObjects } from "../../types/themeTypes";

const DEFAULT_SORT_BY = "byMistypeCount:desc";
const SHOWED_MISTYPED_WORDS_COUNT = 10;

const styles: CSSObjects = {
  mistypedWordsWrapper: {
    position: "relative",
    width: "90vw",
    height: "48vh",
    margin: "0 auto"
  },
  noDataWrapper: {
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  mistypedWordsRange: {
    position: "absolute",
    margin: "0.3rem 0 0 1rem",
    display: "inline-block",
    fontSize: "0.7rem",
    verticalAlign: "top"
  },
  filter: ({ palette }) => ({
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
    "& .MuiFormLabel-root": {
      padding: "0 0.3rem",
      background: palette.background.paper,
      borderRadius: "0.2rem"
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: palette.info.main
    },
    "& input + fieldset": {
      borderTop: "none",
      borderLeft: "none"
    },
    "& input:hover + fieldset": {
      borderColor: `${palette.info.main}`
    },
    "& input:focus + fieldset": {
      borderColor: `${palette.info.main}`
    }
  })
};

interface Props {
  mistypedWordsObj: MistypedWordsLogV2 | null;
}

export default function MistypedWordsChartWrapper({ mistypedWordsObj }: Props) {
  const [filteredIndexes, setFilteredIndexes] = useState<number[]>([]);
  const [displayedMistypedWordsSeries, setDisplayedMistypedWordsSeries] = useState<{x: string; y: number; }[]>([]);
  const [displayedMistypedWordsRange, setDisplayedMistypedWordsRange] = useState<[number, number]>([0, SHOWED_MISTYPED_WORDS_COUNT]);
  const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT_BY);
  const [chartHeight, setChartHeight] = useState("0px");
  const [filter, setFilter] = useState("");

  const wrapperRef = useRef<null | HTMLDivElement>(null);

  const handleWheel = (e: WheelEvent) => {
    if(e.deltaY < 0) {
      setDisplayedMistypedWordsRange(prev => {
        const arrIndexStart = Math.max(0, prev[0] - SHOWED_MISTYPED_WORDS_COUNT);
        return [arrIndexStart, arrIndexStart + SHOWED_MISTYPED_WORDS_COUNT];
      })
    }
    else {
      const filteredMistypedWordCount = filter
        ? filteredIndexes.length
        : mistypedWordsObj?.length ?? 0;
      setDisplayedMistypedWordsRange(prev => {
        const arrIndexStart = Math.min(
          filteredMistypedWordCount - SHOWED_MISTYPED_WORDS_COUNT,
          prev[0] + SHOWED_MISTYPED_WORDS_COUNT
        );
        return [arrIndexStart, arrIndexStart + SHOWED_MISTYPED_WORDS_COUNT];
      })
    }
  };

  const handleSortChange = (value: SortBy) => setSortBy(value);
  const handleFilterChange = (value: string) => setFilter(value);

  useEffect(() => {
    if(mistypedWordsObj === null) return;

    // TODO don't filter again if the filter stays the same
    const newFilteredIndexes = getFilteredMistypeWordIndexes(mistypedWordsObj, filter);
    setFilteredIndexes(newFilteredIndexes);
    // const filteredMistypedWordsSeries = filterMistypedWords(mistypedWords, filter);
    // TODO when the sorting direction is changed just reverse the array
    const sortedMistypedWords = sortMistypedWords(mistypedWordsObj, newFilteredIndexes, sortBy);
    // setFilteredMistypedWords(sortedMistypedWords);

    const croppedMistypedWords = sortedMistypedWords.slice(...displayedMistypedWordsRange);
    const mistypedWordsSeries = transformMistypeWordsToSeries(croppedMistypedWords);

    setDisplayedMistypedWordsSeries(mistypedWordsSeries);
  },[sortBy, mistypedWordsObj, displayedMistypedWordsRange, filter]);

  useEffect(() => {
    if(wrapperRef.current) {
      const wrapperHeight = getComputedStyle(wrapperRef.current).height;
      const heightNumber = transformPixelSizeToNumber(wrapperHeight);
      const calculatedChartHeight = getMistypedWordsChartHeight(heightNumber);
      setChartHeight(calculatedChartHeight);
    }
  },[])

  return (
    <Paper
      sx={styles.mistypedWordsWrapper}
      ref={wrapperRef}
      variant="outlined"
    >
      <Typography variant="h6" align="center">
        Chybně napsaná slova
        <Typography sx={styles.mistypedWordsRange} variant="body2">
          {`${displayedMistypedWordsRange[0] + 1} - ${displayedMistypedWordsRange[1]}/${filteredIndexes.length}`}
        </Typography>
      </Typography>
      <TextField
        sx={styles.filter}
        value={filter}
        label="najdi"
        variant="outlined"
        size="small"
        onChange={e => handleFilterChange(e.target.value)} />
      {displayedMistypedWordsSeries?.length > 1 &&
        <MistypedWordsSorter sortBy={sortBy} handleSortChange={handleSortChange} />
      }
      {!displayedMistypedWordsSeries?.length
        ? <Box sx={styles.noDataWrapper}>
            <Typography>...žádná nenalezena</Typography>
          </Box>
        : <MistypedWordsChart
            mistypedWordsSeries={displayedMistypedWordsSeries}
            handleWheel={handleWheel}
            chartHeight={chartHeight} />
      }
    </Paper>
  );
}

// TODO don't scroll up when on top and vice versa
// BUG reset scroll when filtering (shows no data when scrolled too much and adds filter)
