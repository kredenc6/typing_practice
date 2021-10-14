import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import ReactApexCharts from "react-apexcharts";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { MistypedWordsLog, Results } from "../../types/otherTypes";
import defaultLastResultsChartOptions, { mistypedWordsChartDefaultOptions, timestampsToXAxisCategories, updateXAxisCategories } from "./lastResultsChartOptions";
import { makeStyles } from "@material-ui/styles";
import { sortMistypedWords } from "./helpFunction";

const useStyles = makeStyles({
  lastResultsChartWrapper: {
    maxWidth: "90vw",
    margin: "1rem auto",
    width: ({ itemCount }: { itemCount: number; }) => `${Math.max(500, itemCount * 120)}px`,
    height: "20rem",
  },
   mistypedWordsWrapper: {
     maxHeight: "50vh",
     width: "95%",
     margin: "1rem auto",
     padding: "1rem",
     overflowX: "hidden",
     overflowY: "auto"
   }
});

export default function Statistics() {
  const [precision, setPrecision] = useState<number[]>([]);
  const [typingSpeed, setTypingSpeed] = useState<number[]>([]);
  const [textLength, setTextLength] = useState<number[]>([]);
  const [lastResultsChartOptions, setLastResultsChartOptions] =
    useState(defaultLastResultsChartOptions);
  const [sumOfMistypes, setSumOfMistypes] = useState<{x: string; y: number; }[]>([]);
  const classes = useStyles({ itemCount: typingSpeed.length});
  
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

      setPrecision(savedPrecision);
      setTypingSpeed(savedTypingSpeed);
      setTextLength(savedTextLength);
      const xAxisCategories = timestampsToXAxisCategories(savedResultTimestamps);
      
      setLastResultsChartOptions( prev => {
        return updateXAxisCategories(prev, xAxisCategories);
      });
    } else {
      // TODO this won't be needed if the chart won't be rendered on falsy value
      setPrecision(savedPrecision);
      setTypingSpeed(savedTypingSpeed);
      setTextLength(savedTextLength);
      
      setLastResultsChartOptions( prev => {
        return updateXAxisCategories(prev, []);
      });
    }

    if(mistypedWordsFromStorage) {
      const savedMistypedWords = JSON.parse(mistypedWordsFromStorage) as MistypedWordsLog;
      const sortedMistypedWordsKeyValue = sortMistypedWords(savedMistypedWords);
      
      const mistypedWordsSeries = sortedMistypedWordsKeyValue
        .map(([key, { sumOfMistypes }]) => ({ x: key, y: sumOfMistypes }));
      setSumOfMistypes(mistypedWordsSeries);
    }
  }, [])

  return (
    <Box>
      <Typography variant="h4" align="center">Statistics</Typography>
      <Box className={classes.lastResultsChartWrapper}>
        <ReactApexCharts
          id="lastResultsChart"
          options={lastResultsChartOptions}
          series={[
            { name: "přesnost", data: precision, type: "bar" },
            { name: "rychlost", data: typingSpeed, type: "bar" },
            { name: "délka textu", data: textLength, type: "line" }
          ]}
          // type="bar"
          width="100%"
          height="100%" />
      </Box>
      <Paper className={classes.mistypedWordsWrapper}>
        <ReactApexCharts
          id="mistypedWordsChart"
          options={mistypedWordsChartDefaultOptions}
          series={[{ name: "slova", data: sumOfMistypes }]}
          type="treemap"
          width="100%"
          height="200" />
      </Paper>
    </Box>
  );
}
