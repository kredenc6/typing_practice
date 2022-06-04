import { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core";
import ReactApexCharts from "react-apexcharts";
import { createMistypedWordsChartOptions } from "../../pages/Statistics/chartOptions";
import { calculateHeight_MistypedWordsChart } from "../../pages/Statistics/helpFunction";

interface Props {
  mistypedWordsSeries: {x: string; y: number; }[];
}

export default function MistypedWordsChart({ mistypedWordsSeries }: Props) {
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
          ...prev.tooltip, theme: theme.palette.type
        },
      }
    });
  }, [theme])

  return (
    <ReactApexCharts
      id="mistypedWordsChart"
      options={mistypedWordsChartOptions}
      series={[{ name: "slova", data: mistypedWordsSeries }]}
      type="bar"
      width="98%"
      height={calculateHeight_MistypedWordsChart(mistypedWordsSeries.length)} />
  );
}
