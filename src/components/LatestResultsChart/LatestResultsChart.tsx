import { useEffect, useState } from "react";
import { Box, Typography, Paper, makeStyles, useTheme } from "@material-ui/core";
import ReactApexCharts from "react-apexcharts";
import { createLatestResultsChartOptions, timestampsToXAxisCategories } from "../../pages/Statistics/chartOptions";

const LAST_RESULTS_CHART_MINIMAL_WIDTH = 500;

interface Props {
  precision: number[];
  typingSpeed: number[];
  textLength: number[];
  timestamps: number[];
}

const useStyles = makeStyles({
  lastResultsChartWrapper: {
    minWidth: `${LAST_RESULTS_CHART_MINIMAL_WIDTH}px`,
    width: "90vw",
    margin: "0.5rem auto 1rem",
    paddingBottom: "2.5rem"
  },
  noDataWrapper: {
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  chart: {
    width: "min-content",
    margin: "0 auto",
    border: "1px solid blue"
  }
});

export default function LatestResultsChart({ precision, typingSpeed, textLength, timestamps }: Props) {
  const theme = useTheme();
  const classes = useStyles();
  const chartWidth = `${Math.max(LAST_RESULTS_CHART_MINIMAL_WIDTH, typingSpeed.length * 120)}px`;
  const [latestResultsChartOptions, setLatestResultsChartOptions] = useState(createLatestResultsChartOptions(theme));

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
    <Paper variant="outlined" className={classes.lastResultsChartWrapper}>
      <Typography variant="h6" align="center">Výsledky za posledních 10 opisů</Typography>
      {
        !timestamps?.length
          ? <Box className={classes.noDataWrapper}>
              <Typography>...žádné nenalezeny</Typography>
            </Box>
          : <ReactApexCharts
              className={classes.chart}
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
    </Paper>
  );
}
