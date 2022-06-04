import { useEffect, useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { MistypedWordsLog, Results, SortBy } from "../../types/otherTypes";
import { sortMistypedWords, transformMistypeWordsToSeries } from "./helpFunction";
import MistypedWordsChartWrapper from "../../components/MistypedWordsChartWrapper/MistypedWordsChartWrapper";
import LatestResultsChart from "../../components/LatestResultsChart/LatestResultsChart";
import ThemeSwitch from "../../components/ThemeSwith/ThemeSwith";

const DEAFULT_SORT_BY = "count:desc";

const useStyles = makeStyles(({ palette }) => ({
  statistics: {
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "50% 50%",
    textAlign: "center",
    color: palette.text.primary,
    backgroundColor: palette.background.default
  }
}));

export default function Statistics() {
  const classes = useStyles();
  const [precision, setPrecision] = useState<number[]>([]);
  const [typingSpeed, setTypingSpeed] = useState<number[]>([]);
  const [textLength, setTextLength] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [mistypedWords, setMistypedWords] = useState<MistypedWordsLog>({});
  const [mistypedWordsSeries, setMistypedWordsSeries] = useState<{x: string; y: number; }[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>(DEAFULT_SORT_BY);

  useEffect(() => {
    const lastResultsFromStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_RESULTS);
    const mistypedWordsFromStorage = localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS);

    const savedPrecision: number[] = [];
    const savedResultTimestamps: number[] = [];
    const savedTypingSpeed: number[] = [];
    const savedTextLength: number[] = [];
    
    if(lastResultsFromStorage) {
      const savedLastResults = JSON.parse(lastResultsFromStorage) as Results[];

      savedLastResults.forEach(({ precision, timestamp, typingSpeed, textLength }) => {
        savedPrecision.push(precision);
        savedResultTimestamps.push(timestamp);
        savedTypingSpeed.push(typingSpeed);
        savedTextLength.push(textLength);
      });
    }

    setPrecision(savedPrecision);
    setTypingSpeed(savedTypingSpeed);
    setTextLength(savedTextLength);
    setTimestamps(savedResultTimestamps);

    if(mistypedWordsFromStorage) {
      const savedMistypedWords = JSON.parse(mistypedWordsFromStorage) as MistypedWordsLog;
      setMistypedWords(savedMistypedWords);
    }
  }, [])

  useEffect(() => {
    const sortedMistypedWordsKeyValue = sortMistypedWords(mistypedWords, sortBy);
    const mistypedWordsSeries = transformMistypeWordsToSeries(sortedMistypedWordsKeyValue);
    setMistypedWordsSeries(mistypedWordsSeries);
  },[sortBy, mistypedWords]);

  return (
    <Box className={classes.statistics}>
      <ThemeSwitch />
      <LatestResultsChart
        precision={precision}
        textLength={textLength}
        timestamps={timestamps}
        typingSpeed={typingSpeed} />
      <MistypedWordsChartWrapper
        sortBy={sortBy}
        handleSortChange={setSortBy}
        mistypedWordsSeries={mistypedWordsSeries} />
    </Box>
  );
}

// TODO already sorted results could be saved in state
// TODO try to switch text length line for bar and the other two for line (in the chart)
// TODO add alphabetical sorting
// TODO add text filtering
