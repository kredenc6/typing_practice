import { useEffect, useState } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { MistypedWordsLogV2, Results } from "../../types/otherTypes";
import MistypedWordsChartWrapper from "../../components/MistypedWordsChartWrapper/MistypedWordsChartWrapper";
import LatestResultsChart from "../../components/LatestResultsChart/LatestResultsChart";
import ThemeSwitch from "../../components/ThemeSwith/ThemeSwith";

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
  const [mistypedWordsObj, setMistypedWordsObj] = useState<MistypedWordsLogV2 | null>(null);

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
      const savedMistypedWords = JSON.parse(mistypedWordsFromStorage) as MistypedWordsLogV2;
      console.log(savedMistypedWords)
      setMistypedWordsObj(savedMistypedWords);
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
        mistypedWordsObj={mistypedWordsObj} />
    </Box>
  );
}

// TODO already sorted results could be saved in state
// TODO try to switch text length line for bar and the other two for line (in the chart)
// TODO add alphabetical sorting
// TODO add text filtering
