import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import SimpleBar from "simplebar-react";
import ReactApexCharts from "react-apexcharts";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { MistypedWordsLog, Results } from "../../types/otherTypes";
import {
  defaultLastResultsChartOptions, mistypedWordsChartDefaultOptions,
  timestampsToXAxisCategories
} from "./chartOptions";
import { makeStyles } from "@material-ui/styles";
import { sortMistypedWords } from "./helpFunction";
import "simplebar/dist/simplebar.min.css";

const LAST_RESULTS_CHART_MINIMAL_WIDTH = 500;
const MISTYPE_WORDS_CHART_MINIMAL_HEIGHT = 450;

const useStyles = makeStyles({
  lastResultsChartWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr",
    justifyItems: "center",
    minWidth: `${LAST_RESULTS_CHART_MINIMAL_WIDTH}px`,
    width: "90vw",
    margin: "1rem auto",
    paddingBottom: "1.5rem"
    // width: ({ itemCount }: { itemCount: number; }) => `${Math.max(LAST_RESULTS_CHART_MINIMAL_WIDTH, itemCount * 120)}px`
  },
   mistypedWordsWrapper: {
     maxHeight: "90%",
     height: "calc(48vh - 2rem)",
     width: "95%",
     margin: "0 auto",
     padding: "5px 0 7px"
   }
});

export default function Statistics() {
  const [precision, setPrecision] = useState<number[]>([]);
  const [typingSpeed, setTypingSpeed] = useState<number[]>([]);
  const [textLength, setTextLength] = useState<number[]>([]);
  const [lastResultsChartOptions, setLastResultsChartOptions] =
    useState(defaultLastResultsChartOptions);
  const [mistypedWordsSeries, setMistypedWordsSeries] = useState<{x: string; y: number; }[]>([]);
  const [mistypedWordsChartHeight, setMistypedWordsChartHeight] = useState(MISTYPE_WORDS_CHART_MINIMAL_HEIGHT);
  const [simpleBarheight, setSimpleBarHeight] = useState("0px");
  const classes = useStyles({ itemCount: typingSpeed.length });

  const mistypedWordsWrapperRef = useRef<null | HTMLDivElement>(null);
  const chartWidth = `${Math.max(LAST_RESULTS_CHART_MINIMAL_WIDTH, typingSpeed.length * 120)}px`;
  
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
      
      setLastResultsChartOptions({ xaxis: { categories: xAxisCategories }});
    } else {
      // TODO this won't be needed if the chart won't be rendered on falsy value
      setPrecision(savedPrecision);
      setTypingSpeed(savedTypingSpeed);
      setTextLength(savedTextLength);
      
      setLastResultsChartOptions({ xaxis: { categories: [] }});
    }

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
      setMistypedWordsChartHeight( Math.max(MISTYPE_WORDS_CHART_MINIMAL_HEIGHT, mistypesCount * 3));
    }
  }, [])

  useLayoutEffect(() => {
    const setSimpleBarHeightFun = () => {
      if(mistypedWordsWrapperRef.current) {
        const {
          height,
          paddingTop,
          paddingBottom
        } = getComputedStyle(mistypedWordsWrapperRef.current);
        setSimpleBarHeight(`calc(${height} - ${paddingTop} - ${paddingBottom})`);
      }
    };
    
    setSimpleBarHeightFun();
    window.addEventListener("resize", setSimpleBarHeightFun);
    return () => window.removeEventListener("resize", setSimpleBarHeightFun);
  },[])

  return (
    <Box sx={{ height: "100vh", display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "50% 50%", textAlign: "center" }}>
      <Box className={classes.lastResultsChartWrapper}>
        <Typography variant="h6" align="center">Výsledky za posledních 10 opisů</Typography>
        <ReactApexCharts
          id="lastResultsChart"
          options={lastResultsChartOptions}
          series={[
            { name: "přesnost", data: precision, type: "bar" },
            { name: "rychlost", data: typingSpeed, type: "bar" },
            { name: "délka textu", data: textLength, type: "line" }
          ]}
          width={chartWidth}
          height="100%" />
      </Box>
      <Box>
        <Typography variant="h6" align="center">Chybně napsaná slova</Typography>
        <Paper
          variant="outlined"
          className={classes.mistypedWordsWrapper}
          {...{ ref: mistypedWordsWrapperRef } as any}
        >
          <SimpleBar
            style={{ overflowX: "hidden", padding: "0 10px", maxHeight: simpleBarheight }}
          >
            <ReactApexCharts
              id="mistypedWordsChart"
              options={mistypedWordsChartDefaultOptions}
              series={[{ name: "slova", data: mistypedWordsSeries }]}
              type="treemap"
              width="100%"
              height={`${mistypedWordsChartHeight}px`} />
          </SimpleBar>
        </Paper>
      </Box>
    </Box>
  );
}
