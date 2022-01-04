import { useEffect, useState } from "react";
import { Box, Typography, makeStyles, useTheme } from "@material-ui/core";
import ReactApexCharts from "react-apexcharts";
import { createLastResultsChartOptions, defaultLastResultsChartOptions as defaultLatestResultsChartOptions, timestampsToXAxisCategories } from "../Statistics/chartOptions";

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

export default function LatestResultsChart({ precision, typingSpeed, textLength, timestamps }: Props) {
  const theme = useTheme();
  const classes = useStyles();
  const chartWidth = `${Math.max(LAST_RESULTS_CHART_MINIMAL_WIDTH, typingSpeed.length * 120)}px`;
  const [latestResultsChartOptions, setLatestResultsChartOptions] = useState(createLastResultsChartOptions(theme));

  useEffect(() => {
    const xAxisCategories = timestampsToXAxisCategories(timestamps);
    setLatestResultsChartOptions(prev => {
      return {
        ...prev,
        chart: {
          ...prev.chart, foreColor: theme.palette.text.primary
        },
        tooltip: {
          ...prev.tooltip, theme: theme.palette.type
        },
        xaxis: {
          ...prev.xaxis, categories: xAxisCategories
        }
      }
    });
  }, [timestamps, theme])

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
              options={latestResultsChartOptions}
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
