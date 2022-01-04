import { useEffect, useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { MistypedWordsLog, Results } from "../../types/otherTypes";
import { calcMistypedWordsChartWidth, sortMistypedWords } from "./helpFunction";
import MistypedWordsChartWrapper from "../MistypedWordsChartWrapper/MistypedWordsChartWrapper";
import LatestResultsChart from "../LatestResultsChart/LatestResultsChart";
import ThemeSwitch from "../ThemeSwith/ThemeSwith";

const MISTYPE_WORDS_CHART_MIN_HEIGHT = 150;
const MISTYPE_WORDS_CHART_MIN_WIDTH = 250;

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
  const [mistypedWordsSeries, setMistypedWordsSeries] = useState<{x: string; y: number; }[]>([]);
  const [mistypedWordsChartHeight, setMistypedWordsChartHeight] = useState(MISTYPE_WORDS_CHART_MIN_HEIGHT);
  const [mistypedWordsChartWidth, setMistypedWordsChartWidth] = useState(`${MISTYPE_WORDS_CHART_MIN_WIDTH}px`);

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
      const sortedMistypedWordsKeyValue = sortMistypedWords(savedMistypedWords);
      
      let mistypesCount = 0;
      const mistypedWordsSeries = sortedMistypedWordsKeyValue
        .map(([key, { sumOfMistypes }]) => {
          mistypesCount += sumOfMistypes;  
          return { x: key, y: sumOfMistypes };
        });
      setMistypedWordsSeries(mistypedWordsSeries);
      setMistypedWordsChartHeight( Math.max(MISTYPE_WORDS_CHART_MIN_HEIGHT, mistypesCount * 3));
      const calculatedMistypedWordsChartWidth = calcMistypedWordsChartWidth(mistypesCount);
      setMistypedWordsChartWidth(calculatedMistypedWordsChartWidth);
    }
  }, [])

  return (
    <Box className={classes.statistics}>
      <ThemeSwitch />
      <LatestResultsChart
        precision={precision}
        textLength={textLength}
        timestamps={timestamps}
        typingSpeed={typingSpeed} />
      <MistypedWordsChartWrapper
        mistypedWordsChartHeight={mistypedWordsChartHeight}
        mistypedWordsChartWidth={mistypedWordsChartWidth}
        mistypedWordsSeries={mistypedWordsSeries} />
    </Box>
  );
}
