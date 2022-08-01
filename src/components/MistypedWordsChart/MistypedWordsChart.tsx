import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import ReactApexCharts from "react-apexcharts";
import { createMistypedWordsChartOptions } from "../../pages/Statistics/chartOptions";
// import { calculateHeight_MistypedWordsChart } from "../../pages/Statistics/helpFunction";

interface Props {
  mistypedWordsSeries: {x: string; y: number; }[];
  handleWheel: (e: WheelEvent) => void;
  chartHeight: string;
}

export default function MistypedWordsChart({
  mistypedWordsSeries, handleWheel, chartHeight
}: Props) {
  const theme = useTheme();
  const [mistypedWordsChartOptions, setMistypedWordsChartOptions] = useState(createMistypedWordsChartOptions(theme));

  useEffect(() => {
    setMistypedWordsChartOptions(prev => {
      return {
        ...prev,
        chart: {
          ...prev.chart, foreColor: theme.palette.text.primary
        },
        tooltip: {
          ...prev.tooltip, theme: theme.palette.mode
        },
      }
    });
  }, [theme])

  return (
    <ReactApexCharts
      onWheel={handleWheel}
      id="mistypedWordsChart"
      options={mistypedWordsChartOptions}
      series={[{ name: "slova", data: mistypedWordsSeries }]}
      type="bar"
      width="98%"
      height={chartHeight} />
      // height={calculateHeight_MistypedWordsChart(mistypedWordsSeries.length)} />
  );
}

// TODO see if you can keep the x axis to scale(through scrolling) with the max mistype count
