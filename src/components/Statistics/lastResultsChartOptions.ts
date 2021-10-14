import { ApexOptions } from "apexcharts";
import dateFormat from "dateformat";

const defaultLastResultsChartOptions: ApexOptions = {
  colors: ["rgba(0, 143, 251, 0.9)", "rgba(91, 209, 215, 0.9)", "rgba(240, 91, 76, 0.9)"],
  chart: {
    id: "lastResultsChart",
    toolbar: {
      show: false
    },
    selection: {
      enabled: false
    }
  },
  stroke: {
    colors: ["rgba(0, 143, 251, 0)", "rgba(91, 209, 215, 0)", "rgba(240, 91, 76, 0.9)"],
    lineCap: "round"
  },
  tooltip: {
    y: {
      formatter: (value, { seriesIndex }) => {
        const suffixes = ["%", " úhozů/m", " znaků"];
        return `${value}${suffixes[seriesIndex]}`;
      }
    }
  },
  xaxis: {
    tooltip: {
      enabled: false
    }
  },
  yaxis: [
    {
      title: {
        text: "přesnost"
      },
      labels: {
        formatter: value => `${value}%`
      }
    },
    {
      opposite: true,
      title: {
        text: "rychlost (úhozy za minutu)"
      },
      labels: {
        formatter: value => `${value}`
      }
    },
    {
      show: false
    }
  ]
};

export const mistypedWordsChartDefaultOptions: ApexOptions = {
  chart: {
    id: "mistypedWordsChart",
    toolbar: {
      show: false
    }
  },
};

export const timestampsToXAxisCategories = (timestamps: number[]) => {
  return timestamps.map(timestamp => dateFormat(timestamp, "d. m. HH:MM"));
};

export const updateXAxisCategories = (previousOptions : ApexOptions, categories: string[]): ApexOptions => {
  // TODO use lodash for general update since I have it?
  return {
    ...previousOptions,
    xaxis: {
      ...previousOptions.xaxis,
      categories
  }};
};

export default defaultLastResultsChartOptions;
