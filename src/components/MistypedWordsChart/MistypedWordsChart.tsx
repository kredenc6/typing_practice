import React from "react";
import { Box } from "@material-ui/core";
import ReactApexCharts from "react-apexcharts";
import { mistypedWordsChartDefaultOptions } from "../Statistics/chartOptions";

interface Props {
  mistypedWordsSeries: {x: string; y: number; }[];
  mistypedWordsChartHeight: number;
  mistypedWordsChartWidth: string;
}

export default function MistypedWordsChart({
  mistypedWordsSeries, mistypedWordsChartHeight, mistypedWordsChartWidth
}: Props) {
  return (
    <Box sx={{ display: "inline-block", margin: "0 auto" }}>
      <ReactApexCharts
        id="mistypedWordsChart"
        options={mistypedWordsChartDefaultOptions}
        series={[{ name: "slova", data: mistypedWordsSeries }]}
        type="treemap"
        width={mistypedWordsChartWidth}
        height={`${mistypedWordsChartHeight}px`} />
    </Box>
  );
}
