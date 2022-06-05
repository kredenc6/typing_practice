import { useState, useRef, useEffect } from "react";
import { Box, Paper, Typography, makeStyles } from "@material-ui/core";
import MistypedWordsFilter from "../MistypedWordsFilter/MistypedWordsFilter";
import MistypedWordsChart from "../MistypedWordsChart/MistypedWordsChart";
import { MistypedWordsLog, SortBy } from "../../types/otherTypes";
import { getMistypedWordsChartHeight, sortMistypedWords, transformMistypeWordsToSeries } from "../../pages/Statistics/helpFunction";
import transformPixelSizeToNumber from "../../helpFunctions/transformPixelSizeToNumber";

const DEFAULT_SORT_BY = "count:desc";
const SHOWED_MISTYPED_WORDS_COUNT = 10;

const useStyles = makeStyles({
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
  }
});

interface Props {
  mistypedWords: MistypedWordsLog;
}

export default function MistypedWordsChartWrapper({ mistypedWords }: Props) {
  const classes = useStyles();
  const [mistypedWordsCount, setMistypedWordsCount] = useState(0);
  const [mistypedWordsSeries, setMistypedWordsSeries] = useState<{x: string; y: number; }[]>([]);
  const [displayedMistypedWordsRange, setDisplayedMistypedWordsRange] = useState<[number, number]>([0, SHOWED_MISTYPED_WORDS_COUNT]);
  const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT_BY);
  const [chartHeight, setChartHeight] = useState("0px");

  const testRef = useRef<null | HTMLElement>(null);

  const handleWheel = (e: WheelEvent) => {
    if(e.deltaY < 0) {
      setDisplayedMistypedWordsRange(prev => {
        const arrIndexStart = Math.max(0, prev[0] - SHOWED_MISTYPED_WORDS_COUNT);
        return [arrIndexStart, arrIndexStart + SHOWED_MISTYPED_WORDS_COUNT];
      })
    }
    else {
      const mistypedWordCount = Object.keys(mistypedWords).length;
      setDisplayedMistypedWordsRange(prev => {
        const arrIndexStart = Math.min(
          mistypedWordCount - SHOWED_MISTYPED_WORDS_COUNT,
          prev[0] + SHOWED_MISTYPED_WORDS_COUNT
        );
        return [arrIndexStart, arrIndexStart + SHOWED_MISTYPED_WORDS_COUNT];
      })
    }
  };

  const handleSortChange = (value: SortBy) => {
    setSortBy(value);
  };

  useEffect(() => {
    setMistypedWordsCount(Object.keys(mistypedWords).length);
  }, [mistypedWords])

  useEffect(() => {
    const sortedMistypedWordsKeyValue = sortMistypedWords(mistypedWords, sortBy);
    const croppedMistypedWords = sortedMistypedWordsKeyValue.slice(...displayedMistypedWordsRange);
    const mistypedWordsSeries = transformMistypeWordsToSeries(croppedMistypedWords);
    setMistypedWordsSeries(mistypedWordsSeries);
  },[sortBy, mistypedWords, displayedMistypedWordsRange]);

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
          {`${displayedMistypedWordsRange[0] + 1} - ${displayedMistypedWordsRange[1]}/${mistypedWordsCount}`}
        </Typography>
      </Typography>
      {mistypedWordsSeries?.length > 1 &&
        <MistypedWordsFilter sortBy={sortBy} handleSortChange={handleSortChange} />
      }
      {!mistypedWordsSeries?.length
        ? <Box className={classes.noDataWrapper}>
            <Typography>...žádná nenalezena</Typography>
          </Box>
        : <MistypedWordsChart
            mistypedWordsSeries={mistypedWordsSeries}
            handleWheel={handleWheel}
            chartHeight={chartHeight} />
      }
    </Paper>
  );
}
