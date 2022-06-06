import { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, makeStyles, TextField } from "@material-ui/core";
import MistypedWordsSorter from "../MistypedWordsSorter/MistypedWordsSorter";
import MistypedWordsChart from "../MistypedWordsChart/MistypedWordsChart";
import { MistypedWordsLog, SortBy } from "../../types/otherTypes";
import { filterMistypedWords, getMistypedWordsChartHeight, sortMistypedWords, transformMistypeWordsToSeries } from "../../pages/Statistics/helpFunction";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";

const DEFAULT_SORT_BY = "count:desc";
const SHOWED_MISTYPED_WORDS_COUNT = 10;

const useStyles = makeStyles(({ palette }) => ({
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
  filter: {
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
      borderColor: `${palette.info.main} !important`
    },
    "& input:focus + fieldset": {
      borderColor: `${palette.info.main} !important`
    }
  }
}));

interface Props {
  mistypedWords: MistypedWordsLog;
}

export default function MistypedWordsChartWrapper({ mistypedWords }: Props) {
  const classes = useStyles();
  const [filteredMistypedWords, setFilteredMistypedWords] = useState<any[]>([]);
  const [displayedMistypedWordsSeries, setDisplayedMistypedWordsSeries] = useState<{x: string; y: number; }[]>([]);
  const [displayedMistypedWordsRange, setDisplayedMistypedWordsRange] = useState<[number, number]>([0, SHOWED_MISTYPED_WORDS_COUNT]);
  const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT_BY);
  const [chartHeight, setChartHeight] = useState("0px");
  const [filter, setFilter] = useState("");

  const testRef = useRef<null | HTMLElement>(null);

  const handleWheel = (e: WheelEvent) => {
    if(e.deltaY < 0) {
      setDisplayedMistypedWordsRange(prev => {
        const arrIndexStart = Math.max(0, prev[0] - SHOWED_MISTYPED_WORDS_COUNT);
        return [arrIndexStart, arrIndexStart + SHOWED_MISTYPED_WORDS_COUNT];
      })
    }
    else {
      const filteredMistypedWordCount = filteredMistypedWords.length;
      setDisplayedMistypedWordsRange(prev => {
        const arrIndexStart = Math.min(
          filteredMistypedWordCount - SHOWED_MISTYPED_WORDS_COUNT,
          prev[0] + SHOWED_MISTYPED_WORDS_COUNT
        );
        return [arrIndexStart, arrIndexStart + SHOWED_MISTYPED_WORDS_COUNT];
      })
    }
  };

  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  useEffect(() => {
    const filteredMistypedWordsSeries = filterMistypedWords(mistypedWords, filter);
    const sortedMistypedWordsKeyValue = sortMistypedWords(filteredMistypedWordsSeries, sortBy);
    setFilteredMistypedWords(sortedMistypedWordsKeyValue);

    const croppedMistypedWords = sortedMistypedWordsKeyValue.slice(...displayedMistypedWordsRange);
    const mistypedWordsSeries = transformMistypeWordsToSeries(croppedMistypedWords);

    setDisplayedMistypedWordsSeries(mistypedWordsSeries);
  },[sortBy, mistypedWords, displayedMistypedWordsRange, filter]);

  useEffect(() => {
    if(testRef.current) {
      const wrapperHeight = getComputedStyle(testRef.current).height;
      const heightNumber = transformPixelSizeToNumber(wrapperHeight);
      const calculatedChartHeight = getMistypedWordsChartHeight(heightNumber);
      setChartHeight(calculatedChartHeight);
    }
  },[])



  return (
    <Paper ref={testRef} variant="outlined" className={classes.mistypedWordsWrapper}>
      <Typography variant="h6" align="center">
        Chybně napsaná slova
        <Typography variant="body2" className={classes.mistypedWordsRange}>
          {`${displayedMistypedWordsRange[0] + 1} - ${displayedMistypedWordsRange[1]}/${filteredMistypedWords.length}`}
        </Typography>
      </Typography>
      <TextField
        value={filter}
        label="najdi"
        variant="outlined"
        size="small"
        onChange={e => handleFilterChange(e.target.value)}
        className={classes.filter} />
      {displayedMistypedWordsSeries?.length > 1 &&
        <MistypedWordsSorter sortBy={sortBy} handleSortChange={handleSortChange} />
      }
      {!displayedMistypedWordsSeries?.length
        ? <Box className={classes.noDataWrapper}>
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
