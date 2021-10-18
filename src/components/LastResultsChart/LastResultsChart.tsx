import React, { useEffect, useState } from "react";
import { Box, Typography, makeStyles } from "@material-ui/core";
import ReactApexCharts from "react-apexcharts";
import { defaultLastResultsChartOptions, timestampsToXAxisCategories } from "../Statistics/chartOptions";

const LAST_RESULTS_CHART_MINIMAL_WIDTH = 500;

interface Props {
  precision: number[];
  typingSpeed: number[];
  textLength: number[];
  timestamps: number[];
}

const useStyles = makeStyles({
  lastResultsChartWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr",
    justifyItems: "center",
    minWidth: `${LAST_RESULTS_CHART_MINIMAL_WIDTH}px`,
    width: "90vw",
    margin: "1rem auto",
    paddingBottom: "1.5rem"
  },
  noDataWrapper: {
    height: "200px",
    display: "flex",
    justifyContent: "center"
  }
});

export default function LastResultsChart({ precision, typingSpeed, textLength, timestamps }: Props) {
  const classes = useStyles();
  const chartWidth = `${Math.max(LAST_RESULTS_CHART_MINIMAL_WIDTH, typingSpeed.length * 120)}px`;
  const [lastResultsChartOptions, setLastResultsChartOptions] = useState(defaultLastResultsChartOptions);

  useEffect(() => {
    const xAxisCategories = timestampsToXAxisCategories(timestamps);
    setLastResultsChartOptions(prev => {
      return {
        ...prev,
        xaxis: {
          ...prev.xaxis, categories: xAxisCategories
        }
      }
    });
  }, [timestamps])

  return (
    <Box className={classes.lastResultsChartWrapper}>
      <Typography variant="h6" align="center">Výsledky za posledních 10 opisů</Typography>
      {
        !timestamps?.length
          ? <Box className={classes.noDataWrapper}>
              <Typography variant="h6">...žádná data</Typography>
            </Box>
          : <ReactApexCharts
              id="lastResultsChart"
              options={lastResultsChartOptions}
              series={[
                { name: "přesnost", data: precision, type: "bar" },
                { name: "rychlost", data: typingSpeed, type: "bar" },
                { name: "délka textu", data: textLength, type: "line" }
              ]}
              width={chartWidth}
              height="100%" />
      }
    </Box>
  );
  // return (
  //   <Box className={classes.lastResultsChartWrapper}>
  //     <Typography variant="h6" align="center">Výsledky za posledních 10 opisů</Typography>
  //     <ReactApexCharts
  //       id="lastResultsChart"
  //       options={lastResultsChartOptions}
  //       series={[
  //         { name: "přesnost", data: precision, type: "bar" },
  //         { name: "rychlost", data: typingSpeed, type: "bar" },
  //         { name: "délka textu", data: textLength, type: "line" }
  //       ]}
  //       width={chartWidth}
  //       height="100%" />
  //   </Box>
  // );
}
